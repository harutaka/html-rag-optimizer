"""
このスクリプトは、指定されたHTMLファイルを解析し、
RAG（Retrieval-Augmented Generation）用のデータソースとして最適化します。
主な処理内容は、不要なタグや属性の削除、コメントの除去、
およびテキストの整形などです。
"""

from pathlib import Path
from bs4 import BeautifulSoup, Comment

# 処理対象のHTMLファイルのパスを設定
html_file = Path("files/ACPF_機器管理.html")

def simplify_html(soup, keep_attr=False):
    """
    BeautifulSoupオブジェクトを受け取り、不要な要素や属性を削除して
    HTMLを簡素化します。

    Args:
        soup (BeautifulSoup): 簡素化する対象のBeautifulSoupオブジェクト。
        keep_attr (bool, optional): タグの属性を保持するかどうかを指定。デフォルトはFalse。

    Returns:
        str: 簡素化されたHTMLの文字列。
    """

    # <style>および<script>タグを削除
    for script in soup(["style", "script"]):
        script.decompose()
    
    # 属性を保持しない場合、すべてのタグから属性を削除
    if not keep_attr:
        for tag in soup.find_all(True):
            tag.attrs = {}
    
    # 再帰的に空のタグを削除
    while True:
        removed = False
        for tag in soup.find_all():
            if not tag.text.strip():
                tag.decompose()
                removed = True
        if not removed:
            break
    
    # <a>タグのhref属性を削除
    for tag in soup.find_all("a"):
        del tag["href"]
    
    # コメントを削除
    comments = soup.find_all(string=lambda text: isinstance(text, Comment))
    for comment in comments:
        comment.extract()

    def concat_text(text):
        """
        テキストから改行、タブ、スペースを除去します。

        Args:
            text (str): 処理対象のテキスト。

        Returns:
            str: 空白が除去されたテキスト。
        """
        
        # テキストから改行、タブ、スペースを除去
        text = "".join(text.split("\n"))
        text = "".join(text.split("\t"))
        text = "".join(text.split(" "))
        return text

    # テキストを持たないすべてのタグを削除
    for tag in soup.find_all():
        children = [child for child in tag.contents if not isinstance(child, str)]
        if len(children) == 1:
            tag_text = tag.get_text()
            child_text = "".join([child.get_text() for child in tag.contents if not isinstance(child, str)])
            if concat_text(child_text) == concat_text(tag_text):
                tag.replace_with_children()
    
    # 空行を削除
    res = str(soup)
    lines = [line for line in res.split("\n") if line.strip()]
    res = "\n".join(lines)
    return res

# HTMLファイルを読み込み
with Path(html_file).open() as f:
    html = f.read()

# HTMLを解析
soup = BeautifulSoup(html, "html.parser")

# HTMLをRAG用に圧縮
simplified_html = simplify_html(soup)

# 圧縮後のHTMLを保存
with Path(f"simple_html/{html_file.stem}.html").open("w") as f:
    print(simplified_html, file=f)
