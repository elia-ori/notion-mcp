export function blockToText(block: any): string {
  switch (block.type) {
    case 'paragraph':
      return richTextToPlainText(block.paragraph.rich_text);
    case 'heading_1':
      return `# ${richTextToPlainText(block.heading_1.rich_text)}`;
    case 'heading_2':
      return `## ${richTextToPlainText(block.heading_2.rich_text)}`;
    case 'heading_3':
      return `### ${richTextToPlainText(block.heading_3.rich_text)}`;
    case 'bulleted_list_item':
      return `• ${richTextToPlainText(block.bulleted_list_item.rich_text)}`;
    case 'numbered_list_item':
      return `1. ${richTextToPlainText(block.numbered_list_item.rich_text)}`;
    case 'to_do':
      const checked = block.to_do.checked ? '☑' : '☐';
      return `${checked} ${richTextToPlainText(block.to_do.rich_text)}`;
    case 'code':
      const code = richTextToPlainText(block.code.rich_text);
      const language = block.code.language || '';
      return `\`\`\`${language}\n${code}\n\`\`\``;
    case 'quote':
      return `> ${richTextToPlainText(block.quote.rich_text)}`;
    case 'divider':
      return '---';
    default:
      return '';
  }
}

export function richTextToPlainText(richText: any[]): string {
  return richText.map(text => text.plain_text).join('');
}

export function formatPageProperties(properties: any): Record<string, any> {
  const formatted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(properties)) {
    if (!value) continue;
    
    switch ((value as any).type) {
      case 'title':
        formatted[key] = richTextToPlainText((value as any).title);
        break;
      case 'rich_text':
        formatted[key] = richTextToPlainText((value as any).rich_text);
        break;
      case 'number':
        formatted[key] = (value as any).number;
        break;
      case 'select':
        formatted[key] = (value as any).select?.name || null;
        break;
      case 'multi_select':
        formatted[key] = (value as any).multi_select.map((s: any) => s.name);
        break;
      case 'date':
        formatted[key] = (value as any).date;
        break;
      case 'checkbox':
        formatted[key] = (value as any).checkbox;
        break;
      case 'url':
        formatted[key] = (value as any).url;
        break;
      case 'email':
        formatted[key] = (value as any).email;
        break;
      case 'phone_number':
        formatted[key] = (value as any).phone_number;
        break;
      default:
        formatted[key] = value;
    }
  }
  
  return formatted;
}