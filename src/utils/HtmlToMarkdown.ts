/**
 * Simple function to translate html-tags to markdown-tags
 */
export default function simpleHtmlToMarkdown(html: string) {
  let markdown = html
    .replace(/<b>(.*?)<\/b>/g, "**$1**") // Bald texts
    .replace(/<i>(.*?)<\/i>/g, "_$1_") // Italic texts
    .replace(/<ul>(.*?)<\/ul>/g, (match, p1) => {
      // Unordered lists
      return p1.replace(/<li>(.*?)<\/li>/g, "- $1\n").trim();
    })
    .replace(/<ol>(.*?)<\/ol>/g, (match, p1) => {
      // Ordered lists
      let counter = 1;
      return p1
        .replace(
          /<li>(.*?)<\/li>/g,
          (match: any) =>
            `${counter++}. ${match.replace(/<li>(.*?)<\/li>/, "$1")}\n`
        )
        .trim();
    })
    .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/g, "[$2]($1)") // Links
    .replace(/<p>(.*?)<\/p>/g, "$1\n") // Convert paragraphs to text followed by a newline
    .replace(/<br\s*\/?>/g, "\n") // Convert <br> tags to newlines
    .replace(/<b><i>(.*?)<\/i><\/b>/g, "**_$1_**")
    .replace(/<h1>(.*?)<\/h1>/g, "# $1\n") // convert h1
    .replace(/<h2>(.*?)<\/h2>/g, "## $1\n") // convert h2
    .replace(/<h3>(.*?)<\/h3>/g, "### $1\n") // convert h3
    // there is no underline in markdown: delete <u>-tags because otherwise they become _..._ and this is not correct
    .replace(/<u>/g, "")
    .replace(/<\/u>/g, "");
  return markdown.trim(); // Trim the final string to remove any leading/trailing whitespace
}
