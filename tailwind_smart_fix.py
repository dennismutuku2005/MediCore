import os
import re

def guess_tailwind(style_name):
    lower = style_name.lower()
    if 'grid' in lower or 'layout' in lower or 'kanban' in lower:
        return "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
    if 'card' in lower or 'item' in lower:
        return "bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4"
    if 'row' in lower:
        return "flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0"
    if 'label' in lower or 'meta' in lower:
        return "text-[11px] font-bold text-slate-400 uppercase tracking-wider"
    if 'value' in lower or 'amount' in lower or 'count' in lower:
        return "text-lg font-bold text-slate-800"
    if 'title' in lower or 'header' in lower or 'name' in lower:
        return "text-sm font-bold text-slate-800 uppercase tracking-tight mb-2"
    if 'btn' in lower or 'action' in lower or 'link' in lower:
        return "text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors cursor-pointer"
    if 'avatar' in lower:
        return "w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-sm"
    if 'desc' in lower or 'text' in lower or 'detail' in lower or 'info' in lower:
        return "text-sm text-slate-600 leading-relaxed"
    if 'banner' in lower:
        return "bg-blue-600 text-white rounded-lg p-5 mb-6 shadow-md flex items-center justify-between"
    if 'input' in lower or 'search' in lower:
        return "w-full h-9 px-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
    if 'skeletongroup' in lower:
        return "space-y-6"
    return "relative"

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Find all matches of styles.xyz inside templates or brackets
    # 1. className={styles.xyz}
    def replacer(match):
        style_name = match.group(1)
        tw = guess_tailwind(style_name)
        return f'className="{tw}"'
    
    content = re.sub(r'className=\{styles\.([a-zA-Z0-9_]+)\}', replacer, content)

    # 2. className={`${styles.xyz} ...`}
    def replacer2(match):
        style_name = match.group(1)
        tw = guess_tailwind(style_name)
        return tw
    
    content = re.sub(r'\$\{styles\.([a-zA-Z0-9_]+)\}', replacer2, content)

    # 3. If there are any stray styles.xyz (like in objects or other places)
    # Just replace them with empty string if they are inside className
    # But usually the above two cover everything.

    # 4. Also remove the leftover `import styles` if there is any.
    content = re.sub(r"import styles from [^\n]*\n", "", content)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {path}")

def main():
    base_dir = r"c:\Users\DENNISMUTUKU\Desktop\hospital-ui\src\app"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".tsx"):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
