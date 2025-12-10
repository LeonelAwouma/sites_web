// Inspired by https://github.com/nriesco/deep-diff
"use client"

import * as React from "react"
import { diffChars } from "diff"

type DiffContextValue = {
  Add: React.ElementType
  Remove: React.ElementType
}

const DiffContext = React.createContext<DiffContextValue>({
  Add: ({ children }) => <>{children}</>,
  Remove: ({ children }) => <>{children}</>,
})

function DiffHighlight({
  children,
}: {
  children: (props: { children: React.ReactNode }) => React.ReactNode
}) {
  const context = React.useContext(DiffContext)

  context.Add = ({ children: child }) => children({ children: child })

  return null
}

function Diff({
  className,
  diff: text,
  ...props
}: React.ComponentProps<"pre"> & {
  diff: string
}) {
  const context = React.useContext(DiffContext)
  const [original, modified] = text.split("\n---\n")
  const diff = diffChars(original, modified)

  return (
    <pre {...props}>
      <DiffContext.Provider
        value={{ Add: context.Add, Remove: context.Remove }}
      >
        {props.children}
        {diff.map((part, index) => {
          if (part.added) {
            return (
              <context.Add key={index}>
                {part.value}
              </context.Add>
            )
          } else if (part.removed) {
            return (
              <context.Remove key={index}>
                {part.value}
              </context.Remove>
            )
          } else {
            return <React.Fragment key={index}>{part.value}</React.Fragment>
          }
        })}
      </DiffContext.Provider>
    </pre>
  )
}

export { Diff, DiffHighlight }
