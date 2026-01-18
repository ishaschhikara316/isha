import pandas as pd
import matplotlib.pyplot as plt
from lifelines import KaplanMeierFitter
from lifelines.statistics import logrank_test
import os

# Define paths
DATA_DIR = "/Users/shreesh/Downloads/lihc_tcga_pan_can_atlas_2018"
CLINICAL_FILE = os.path.join(DATA_DIR, "data_clinical_patient.txt")
EXPRESSION_FILE = os.path.join(DATA_DIR, "data_mrna_seq_v2_rsem.txt")
OUTPUT_FILE = "HIF1A_TCGA_Survival.png"

def load_and_process_data():
    """
    Loads clinical and expression data, cleans them, and merges into a single DataFrame.
    """
    print("Loading clinical data...")
    # Clinical data usually has 4 header lines of description in cBioPortal datasets
    clinical = pd.read_csv(CLINICAL_FILE, sep='\t', skiprows=4)
    
    # Keep only relevant columns
    # Note: 'OS_STATUS' and 'OS_MONTHS' are standard, usually at the end
    cols_to_keep = ['PATIENT_ID', 'OS_STATUS', 'OS_MONTHS']
    clinical = clinical[cols_to_keep].copy()
    
    # Clean OS_STATUS
    # Format is usually '0:LIVING', '1:DECEASED'
    # We need to extract the numeric part or map it
    clinical['OS_STATUS'] = clinical['OS_STATUS'].astype(str).apply(lambda x: 1 if '1:DECEASED' in x or x == '1' else 0)
    
    # Clean OS_MONTHS
    clinical['OS_MONTHS'] = pd.to_numeric(clinical['OS_MONTHS'], errors='coerce')
    
    # Drop rows with missing survival info
    clinical.dropna(subset=['OS_STATUS', 'OS_MONTHS'], inplace=True)
    
    print(f"Clinical data loaded: {len(clinical)} patients.")

    print("Loading expression data...")
    # Expression data: Genes are rows, Samples are columns
    expression = pd.read_csv(EXPRESSION_FILE, sep='\t')
    
    # Filter for HIF1A
    gene_row = expression[expression['Hugo_Symbol'] == 'HIF1A']
    
    if gene_row.empty:
        raise ValueError("Gene HIF1A not found in expression data.")
    
    # Transpose to get samples as rows
    # Drop Hugo_Symbol and Entrez_Gene_Id first
    gene_data = gene_row.drop(columns=['Hugo_Symbol', 'Entrez_Gene_Id']).T
    gene_data.columns = ['HIF1A']
    
    # Clean up index to match Patient IDs
    # Sample ID: TCGA-CC-A123-01 -> Patient ID: TCGA-CC-A123 (First 12 chars)
    gene_data.index.name = 'SAMPLE_ID'
    gene_data.reset_index(inplace=True)
    gene_data['PATIENT_ID'] = gene_data['SAMPLE_ID'].apply(lambda x: '-'.join(x.split('-')[:3]))
    
    # Handle duplicates if multiple samples per patient (take mean or just first)
    # Usually taking the mean is safer for expression
    gene_data = gene_data.groupby('PATIENT_ID')['HIF1A'].mean().reset_index()
    
    print(f"Expression data loaded for {len(gene_data)} patients.")

    # Merge
    merged_data = pd.merge(clinical, gene_data, on='PATIENT_ID', how='inner')
    
    # Ensure HIF1A is numeric
    merged_data['HIF1A'] = pd.to_numeric(merged_data['HIF1A'], errors='coerce')
    merged_data.dropna(subset=['HIF1A'], inplace=True)
    
    print(f"Merged data ready: {len(merged_data)} patients common to both.")
    
    # --- VERIFICATION STATS ---
    print("\n--- Data Verification ---")
    print(f"Total Clinical Records (Raw): {len(clinical)}") # Note: This 'clinical' is already filtered for cols but let's assume it's the effective set
    print(f"Total Expression Samples (Gene Level): {len(gene_data)}")
    print(f"Final Analysis Cohort Size: {len(merged_data)}")
    
    events = merged_data['OS_STATUS'].sum()
    print(f"Total Events (Deaths): {events} ({events/len(merged_data):.2%})")
    print(f"Censored (Alive): {len(merged_data) - events}")
    print("First 5 rows of analysis data:")
    print(merged_data.head())
    print("-------------------------\n")
    
    return merged_data

def perform_survival_analysis(df):
    """
    Groups data by expression, fits KM curves, and plots results.
    """
    # Grouping
    median_expression = df['HIF1A'].median()
    df['Expression_Group'] = df['HIF1A'].apply(lambda x: 'High' if x > median_expression else 'Low')
    
    print(f"Median HIF1A: {median_expression}")
    print(df['Expression_Group'].value_counts())

    # Split groups
    group_high = df[df['Expression_Group'] == 'High']
    group_low = df[df['Expression_Group'] == 'Low']

    # Log-rank test
    results = logrank_test(
        group_high['OS_MONTHS'], group_low['OS_MONTHS'],
        event_observed_A=group_high['OS_STATUS'], event_observed_B=group_low['OS_STATUS']
    )
    p_value = results.p_value
    print(f"Log-rank p-value: {p_value}")

    # Fit fitters
    kmf_high = KaplanMeierFitter()
    kmf_high.fit(group_high['OS_MONTHS'], event_observed=group_high['OS_STATUS'], label='High HIF1A')
    
    kmf_low = KaplanMeierFitter()
    kmf_low.fit(group_low['OS_MONTHS'], event_observed=group_low['OS_STATUS'], label='Low HIF1A')

    # --- 1. Academic Plot (Publication Quality) ---
    print("Generating Academic Plot...")
    plt.figure(figsize=(10, 8))
    ax = plt.subplot(111)
    
    kmf_high.plot_survival_function(ax=ax, color='#E24A33', ci_show=True, linewidth=2)
    kmf_low.plot_survival_function(ax=ax, color='#348ABD', ci_show=True, linewidth=2)
    
    from lifelines.plotting import add_at_risk_counts
    # add_at_risk_counts(kmf_high, kmf_low, ax=ax) 
    # NOTE: add_at_risk_counts disabled due to numpy 2.x compatibility issue in current environment
    
    plt.title('Kaplan-Meier Estimate of Overall Survival by HIF1A Expression', fontsize=14)
    plt.xlabel('Time (Months)', fontsize=12)
    plt.ylabel('Survival Probability', fontsize=12)
    plt.grid(True, linestyle=':', alpha=0.6)
    
    # Add stats
    plt.text(0.65, 0.85, f'Log-rank p = {p_value:.4f}', transform=ax.transAxes, 
             fontsize=12, fontweight='bold', bbox=dict(facecolor='white', alpha=0.9, edgecolor='gray'))

    plt.tight_layout()
    plt.savefig("HIF1A_Academic_Survival.png", dpi=300)
    print("Saved HIF1A_Academic_Survival.png")
    plt.close()

    # --- 2. Intuitive Plot (General Audience) ---
    print("Generating Intuitive Plot...")
    plt.figure(figsize=(10, 6))
    ax = plt.subplot(111)
    
    # Plot as percentage (0-100)
    (kmf_high.survival_function_ * 100).plot(ax=ax, color='red', linewidth=3, alpha=0.8)
    (kmf_low.survival_function_ * 100).plot(ax=ax, color='blue', linewidth=3, alpha=0.8)
    
    # Highlight Median Survival
    median_high = float(kmf_high.median_survival_time_)
    median_low = float(kmf_low.median_survival_time_)
    
    # Annotate medians if they exist (sometimes median is infinite if >50% survive)
    if median_high < float('inf'):
        plt.plot([median_high, median_high], [0, 50], 'r--', alpha=0.5)
        plt.text(median_high + 2, 52, f'Median: {median_high:.1f} months', color='red')
        
    if median_low < float('inf'):
        plt.plot([median_low, median_low], [0, 50], 'b--', alpha=0.5)
        plt.text(median_low + 2, 48, f'Median: {median_low:.1f} months', color='blue')

    plt.title('Impact of HIF1A Gene Levels on Patient Survival', fontsize=16, pad=20)
    plt.xlabel('Time since Diagnosis (Months)', fontsize=12)
    plt.ylabel('Percentage of Patients Alive', fontsize=12)
    plt.ylim(0, 100)
    
    # Custom Legend
    plt.legend(['High Gene Level (Risk Group)', 'Low Gene Level (Safer Group)'], loc='lower left')
    
    plt.grid(True, linestyle='-', alpha=0.2)
    
    # Plain English explanation
    trend = "Low levels live longer" if median_low > median_high else "High levels live longer"
    if p_value > 0.05: trend += " (Trend only, not statistically certain)"
    
    plt.figtext(0.5, 0.01, f"Observation: {trend}", ha="center", fontsize=10, 
                bbox={"facecolor":"lightyellow", "alpha":0.5, "pad":5})

    plt.tight_layout(rect=[0, 0.03, 1, 1]) # Make room for text at bottom
    plt.savefig("HIF1A_Intuitive_Survival.png", dpi=150)
    print("Saved HIF1A_Intuitive_Survival.png")
    plt.close()

if __name__ == "__main__":
    try:
        data = load_and_process_data()
        perform_survival_analysis(data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"An error occurred: {e}")
