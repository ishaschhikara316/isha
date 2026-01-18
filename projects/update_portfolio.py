import os

# Paths
INDEX_PATH = "../index.html"
SCRIPT_PATH = "../script.js"
BLOG_ENTRY_PATH = "blog_entry.txt"

def update_index():
    with open(INDEX_PATH, 'r') as f:
        content = f.read()
    
    if 'data-blog-id="survival-analysis"' in content:
        # If it exists, let's remove it first to ensure it's in the right place
        content = content.replace('\n                <div class="portfolio-card" data-blog-id="survival-analysis">', '')
        # This is a bit risky, let's just skip if it exists for now as per previous instruction
        return

    lines = content.splitlines(keepends=True)
    target_idx = -1
    for i, line in enumerate(lines):
        if 'Research Trainee @ DIPAS, DRDO' in line:
            # End of this card is about 8 lines down
            for j in range(i, i + 15):
                if j+2 < len(lines) and '</div>' in lines[j] and '</div>' in lines[j+1] and '</div>' in lines[j+2]:
                    target_idx = j + 3
                    break
            if target_idx != -1: break
    
    if target_idx != -1:
        new_card = """
                <div class="portfolio-card" data-blog-id="survival-analysis">
                    <div class="card-image">
                        <i class="fas fa-chart-line card-icon"></i>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Kaplan-Meier Survival Analysis</h3>
                        <p class="card-description">A bioinformatic extension to my thesis work: analyzing TCGA liver cancer data to validate HIF1A as a prognostic marker using Python-based survival modeling.</p>
                        <div class="card-tags">
                            <span class="tag">Bioinformatics</span>
                            <span class="tag">Python</span>
                            <span class="tag">TCGA Analysis</span>
                        </div>
                    </div>
                </div>
"""
        updated_lines = lines[:target_idx] + [new_card] + lines[target_idx:]
        with open(INDEX_PATH, 'w') as f:
            f.writelines(updated_lines)

def update_script():
    with open(SCRIPT_PATH, 'r') as f:
        content = f.read()
    
    with open(BLOG_ENTRY_PATH, 'r') as f:
        new_entry = f.read().strip()

    # Remove existing
    if "'survival-analysis':" in content:
        # Find start and end
        start_marker = "    'survival-analysis': {"
        end_marker = "    },"
        start_idx = content.find(start_marker)
        if start_idx != -1:
            # We need to find the correct end_marker. 
            # In our file, the next key starts with '    ' and then a key.
            # Or the object ends with };
            # Let's find the closing brace that is followed by a newline and 4 spaces.
            end_idx = content.find(end_marker, start_idx)
            if end_idx != -1:
                content = content[:start_idx] + content[end_idx + len(end_marker):]

    # Insert
    insertion_pt = "const blogData = {"
    content = content.replace(insertion_pt, insertion_pt + "\n    " + new_entry)
    
    with open(SCRIPT_PATH, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_index()
    update_script()
