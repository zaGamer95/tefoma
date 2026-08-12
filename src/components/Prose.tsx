import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ProseProps {
  content: string
}

/**
 * src/content/*.md 를 그대로 렌더링. 본문은 코드에 두지 않는다. (규칙 6번)
 *
 * remark-gfm 이 필요하다. 표는 CommonMark가 아니라 GitHub 확장 문법이라,
 * 이게 없으면 `| 항목 | 값 |` 이 그냥 글자로 나온다.
 */
export function Prose({ content }: ProseProps) {
  return (
    <article className="prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 표는 좁은 화면에서 넘칠 수 있으므로 표 자체가 아니라
          // 감싼 상자가 가로로 스크롤되게 한다. (표에 직접 걸면 열 너비가 깨진다)
          table: ({ children, ...props }) => (
            <div className="table-wrap">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </Markdown>
    </article>
  )
}
