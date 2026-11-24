import React from 'react'

interface LexicalNode {
  type?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  tag?: string
}

function renderInlineNodes(nodes: LexicalNode[] = [], keyPrefix = ''): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`

    if (node.type === 'text') {
      const text = node.text || ''
      // No Lexical, format === 1 representa negrito
      if (node.format && (node.format & 1) === 1) {
        return (
          <strong key={key} className="font-semibold text-ink-primary">
            {text}
          </strong>
        )
      }
      return <React.Fragment key={key}>{text}</React.Fragment>
    }

    if (node.type === 'linebreak') {
      return <br key={key} />
    }

    if (Array.isArray(node.children)) {
      return <React.Fragment key={key}>{renderInlineNodes(node.children, key)}</React.Fragment>
    }

    return null
  })
}

export function RichTextRenderer({ content }: { content: any }) {
  const rootChildren: LexicalNode[] = content?.root?.children || []

  if (!Array.isArray(rootChildren) || rootChildren.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 text-sm leading-relaxed text-ink-secondary">
      {rootChildren.map((block, index) => {
        if (block.type === 'heading') {
          const Tag = (block.tag as 'h2' | 'h3' | 'h4') || 'h3'
          return (
            <Tag key={index} className="pt-2 font-display text-lg font-semibold text-ink-primary">
              {renderInlineNodes(block.children, `h-${index}`)}
            </Tag>
          )
        }

        if (block.type === 'list') {
          const ListTag = block.tag === 'ol' ? 'ol' : 'ul'
          const listStyle = block.tag === 'ol' ? 'list-decimal' : 'list-disc'
          return (
            <ListTag key={index} className={`${listStyle} space-y-1.5 pl-5 text-ink-secondary`}>
              {(block.children || []).map((item, itemIdx) => (
                <li key={itemIdx}>{renderInlineNodes(item.children, `li-${index}-${itemIdx}`)}</li>
              ))}
            </ListTag>
          )
        }

        return <p key={index}>{renderInlineNodes(block.children, `p-${index}`)}</p>
      })}
    </div>
  )
}