import Markdown from 'react-markdown'

interface ProseProps {
  content: string
}

/** src/content/*.md 를 그대로 렌더링. 본문은 코드에 두지 않는다. (규칙 6번) */
export function Prose({ content }: ProseProps) {
  return (
    <article className="prose">
      <Markdown>{content}</Markdown>
    </article>
  )
}
