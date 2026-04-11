import os
import re

style_map = {
    'styles.slidePanelOverlay': '"fixed inset-0 bg-slate-900/20 z-[1001]"',
    'styles.slidePanel': '"fixed right-0 top-0 bottom-0 w-[400px] max-w-full bg-white border-l border-slate-200 z-[1002] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"',
    'styles.slidePanelHeader': '"p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50"',
    'styles.slidePanelTitle': '"text-lg font-bold text-slate-800"',
    'styles.closeBtn': '"p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"',
    'styles.detailSection': '"p-5 border-b border-slate-100"',
    'styles.detailSectionTitle': '"flex items-center justify-between text-sm font-bold text-slate-800 cursor-pointer select-none hover:text-blue-600 transition-colors uppercase tracking-tight mb-2"',
    'styles.detailRow': '"flex justify-between py-1.5 text-sm border-b border-dashed border-slate-100 last:border-0"',
    'styles.detailLabel': '"text-slate-500 font-semibold"',
    'styles.detailValue': '"text-slate-800 font-bold"',
    'styles.mainGrid': '"grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6"',
    'styles.statsGrid': '"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"',
    'styles.statsGrid3': '"grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6"',
    'styles.card': '"bg-white border border-slate-200 rounded-lg p-5 shadow-sm"',
    'styles.section': '"mb-6"',
    'styles.sectionTitle': '"text-base font-bold text-slate-800 mb-4"',
    'styles.formGrid': '"grid grid-cols-1 md:grid-cols-2 gap-4"',
    'styles.splitView': '"flex flex-col lg:flex-row gap-5"',
    'styles.leftPane': '"flex-1 w-full"',
    'styles.rightPane': '"lg:w-[350px] shrink-0 w-full"',
    'styles.activityItem': '"flex gap-3 py-3 border-b border-slate-100 last:border-0"',
    'styles.headerRow': '"flex items-center justify-between mb-6"',
}

def convert_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Replace individual styles
    for k, v in style_map.items():
        # Handle cases where it is inside a template literal: className={`${styles.patientListItem} ...`}
        # This is a bit complex for a simple map, but let's replace exact matches `className={styles.X}`
        content = re.sub(r'className=\{(' + re.escape(k) + r')\}', f'className={v}', content)

    # Remove the import line
    content = re.sub(r"import styles from '\.\./[^']*pages\.module\.css';\n?", "", content)
    content = re.sub(r"import styles from '\.\./\.\./pages\.module\.css';\n?", "", content)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {path}")

def main():
    base_dir = r"c:\Users\DENNISMUTUKU\Desktop\hospital-ui\src\app"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".tsx"):
                convert_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
