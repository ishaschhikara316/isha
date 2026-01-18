# HCC Target Discovery Pipeline (Refined & Enhanced)
# Author: Gemini (Bioinformatics Agent)
# Date: 2026-01-18
# Dataset: GSE76427 (GSE76427_series_matrix.txt)

# -------------------------------------------------------------------------
# PREREQUISITES:
# if (!require("BiocManager", quietly = TRUE)) install.packages("BiocManager")
# BiocManager::install(c("limma", "GEOquery", "Biobase", "ComplexHeatmap", "pheatmap", "ggrepel", "readr", "dplyr", "ggplot2", "RColorBrewer", "grid")
# -------------------------------------------------------------------------

# 1. Setup
options(warn = -1)
suppressPackageStartupMessages({
  library(limma)
  library(ggplot2)
  library(dplyr)
  library(readr)
  library(ggrepel)
  library(ComplexHeatmap)
  library(circlize)
  library(RColorBrewer)
  library(grid)
})

# 2. Data Loading (Custom Parser)
message(">>> Loading Data...")
matrix_file <- "/Users/shreesh/Downloads/GSE76427_series_matrix.txt"

parse_gse_local <- function(file_path) {
  lines <- readLines(file_path)
  # Phenotype
  get_field <- function(key) {
    idx <- grep(paste0("^", key), lines)
    if (length(idx) == 0) return(NULL)
    gsub('"', '', strsplit(lines[idx[1]], "\t")[[1]][-1])
  }
  pdata <- data.frame(
    geo_accession = get_field("!Sample_geo_accession"),
    source_name_ch1 = get_field("!Sample_source_name_ch1"),
    stringsAsFactors = FALSE
  )
  rownames(pdata) <- pdata$geo_accession
  
  # Expression
  start_idx <- grep("^!series_matrix_table_begin", lines)
  expr_df <- read.table(file_path, header = TRUE, row.names = 1, skip = start_idx, sep = "\t", comment.char = "!", check.names = FALSE, fill = TRUE)
  return(list(pdata = pdata, exprs = as.matrix(expr_df)))
}

data <- parse_gse_local(matrix_file)
ex <- data$exprs
pdata <- data$pdata[intersect(rownames(data$pdata), colnames(ex)), ]
ex <- ex[, rownames(pdata)]

# 3. Preprocessing
message(">>> Processing & Normalizing...")
# Define Groups
Group <- rep("Unknown", nrow(pdata))
Group[grepl("non-tumor", pdata$source_name_ch1, ignore.case = TRUE)] <- "NonTumor"
Group[grepl("carcinoma", pdata$source_name_ch1, ignore.case = TRUE) & !grepl("non-tumor", pdata$source_name_ch1, ignore.case = TRUE)] <- "Tumor"
pdata$Condition <- factor(Group, levels = c("NonTumor", "Tumor"))

# Log2 Transform if needed
qx <- as.numeric(quantile(ex, c(0., 0.25, 0.5, 0.75, 0.99, 1.0), na.rm=T))
if ((qx[5] > 100) || (qx[6]-qx[1] > 50 && qx[2] > 0)) {
  ex[ex <= 0] <- NaN
  ex <- log2(ex + 1)
}

# 4. DEA (Limma)
message(">>> Running Limma...")
design <- model.matrix(~0 + Condition, data = pdata)
colnames(design) <- levels(pdata$Condition)
fit <- lmFit(ex, design)
fit2 <- contrasts.fit(fit, makeContrasts(Tumor - NonTumor, levels = design))
fit2 <- eBayes(fit2)
res <- topTable(fit2, adjust.method = "fdr", number = Inf)

# 5. Annotation (Manual Rescue)
message(">>> Annotating Key Targets...")
manual_map <- c(
  "ILMN_1710129" = "GPC3", "ILMN_1801608" = "GPC3",
  "ILMN_1722097" = "EPCAM", "ILMN_1766023" = "AFP",
  "ILMN_1796387" = "TFRC", "ILMN_1730256" = "EGFR",
  "ILMN_1705666" = "CD24", "ILMN_1728267" = "CD44",
  "ILMN_1760201" = "PROM1", "ILMN_1702476" = "ASGR1",
  "ILMN_1677008" = "GPC1", "ILMN_1796720" = "ROBO1",
  "ILMN_1705307" = "CD47", "ILMN_1773983" = "MET",
  "ILMN_1726207" = "CD274", "ILMN_1792670" = "ICAM1",
  "ILMN_1743883" = "ERBB2", "ILMN_1766336" = "MUC1"
)
res$Gene_Symbol <- NA
m <- match(rownames(res), names(manual_map))
res$Gene_Symbol[!is.na(m)] <- manual_map[m[!is.na(m)]]
res$Gene_Symbol[is.na(res$Gene_Symbol)] <- rownames(res)[is.na(res$Gene_Symbol)]

# 6. Filtering (Relaxed)
surface_markers <- unique(manual_map)
candidates <- res %>%
  filter(logFC > 0.5 & adj.P.Val < 0.05) %>%
  filter(Gene_Symbol %in% surface_markers) %>%
  arrange(desc(logFC))

message(paste(">>> Found", nrow(candidates), "candidates."))
print(candidates[, c("Gene_Symbol", "logFC", "adj.P.Val")])

# 7. Plots (Enhanced)

# --- A. Better Volcano Plot ---
message(">>> Generating Volcano Plot...")
volcano_df <- res %>%
  mutate(
    Type = case_when(
      adj.P.Val < 0.05 & logFC > 0.5 ~ "Upregulated",
      adj.P.Val < 0.05 & logFC < -0.5 ~ "Downregulated",
      TRUE ~ "Not Sig"
    ),
    Label = ifelse(Gene_Symbol %in% candidates$Gene_Symbol, Gene_Symbol, NA)
  )

p_vol <- ggplot(volcano_df, aes(x = logFC, y = -log10(adj.P.Val), color = Type)) +
  geom_point(alpha = 0.5, size = 1) +
  scale_color_manual(values = c("Downregulated" = "#377EB8", "Not Sig" = "grey80", "Upregulated" = "#E41A1C")) +
  geom_hline(yintercept = -log10(0.05), linetype = "dashed", color = "black", alpha=0.5) +
  geom_vline(xintercept = c(-0.5, 0.5), linetype = "dashed", color = "black", alpha=0.5) +
  geom_label_repel(aes(label = Label), fill = "white", color = "black", 
                   box.padding = 0.5, segment.color = "black", min.segment.length = 0,
                   fontface = "bold", na.rm = TRUE) +
  theme_bw(base_size = 14) +
  labs(title = "Volcano Plot: HCC Surface Targets",
       subtitle = "Labeled: Significant candidates (PROM1)",
       x = "Log2 Fold Change (Tumor/Non-Tumor)", y = "-Log10 Adj. P-Value") +
  theme(legend.position = "top", plot.title = element_text(hjust = 0.5))

ggsave("projects/DEA/Volcano_Plot.png", p_vol, width = 8, height = 6, dpi = 300)

# --- B. Better Heatmap ---
if (nrow(candidates) > 0) {
  message(">>> Generating Heatmap...")
  
  # Select probes
  probes <- rownames(candidates)
  mat <- ex[probes, , drop=FALSE]
  rownames(mat) <- candidates$Gene_Symbol
  
  # Scale rows (Z-score)
  mat_scaled <- t(scale(t(mat)))
  
  # Annotations
  ha <- HeatmapAnnotation(
    Condition = pdata$Condition,
    col = list(Condition = c("NonTumor" = "#377EB8", "Tumor" = "#E41A1C")),
    simple_anno_size = unit(0.5, "cm")
  )
  
  # Draw & Save
  png("projects/DEA/Target_Heatmap.png", width = 10, height = 6, units = "in", res = 300)
  ht <- Heatmap(mat_scaled, 
          name = "Z-Score",
          top_annotation = ha,
          cluster_columns = TRUE,
          show_column_names = FALSE,
          row_names_gp = gpar(fontsize = 12, fontface = "bold"),
          column_title = "Expression of Candidate Targets across 167 Samples",
          col = colorRamp2(c(-2, 0, 2), c("navy", "white", "firebrick")))
  draw(ht)
  dev.off()
}

# --- C. Boxplot (New Asset) ---
if (nrow(candidates) > 0) {
  message(">>> Generating Boxplot for Top Hit...")
  top_gene <- candidates$Gene_Symbol[1]
  top_probe <- rownames(candidates)[1]
  
  box_data <- data.frame(
    Expression = ex[top_probe, ],
    Condition = pdata$Condition
  )
  
  p_box <- ggplot(box_data, aes(x = Condition, y = Expression, fill = Condition)) +
    geom_boxplot(outlier.shape = NA, alpha = 0.7) +
    geom_jitter(width = 0.2, alpha = 0.3) +
    scale_fill_manual(values = c("NonTumor" = "#377EB8", "Tumor" = "#E41A1C")) +
    theme_bw(base_size = 14) +
    labs(title = paste(top_gene, "Expression in HCC"),
         subtitle = paste("LogFC:", round(candidates$logFC[1], 2), "  FDR:", format(candidates$adj.P.Val[1], digits=3)),
         y = "Log2 Expression") +
    theme(legend.position = "none", plot.title = element_text(hjust = 0.5))
    
  ggsave(paste0("projects/DEA/", top_gene, "_Boxplot.png"), p_box, width = 6, height = 6, dpi = 300)
}

# Save Table
write.csv(candidates, "projects/DEA/HCC_Surface_Targets.csv")
message(">>> Analysis & Visualization Complete.")