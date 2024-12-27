import { Space } from "@repo/data/models"
import {
  createContext,
  CSSProperties,
  HTMLAttributes,
  PropsWithChildren,
  useContext,
} from "react"

interface Context {
  active?: Space
  all: Space[]
}

const Context = createContext<Context>({ all: [] })

/**
 * Provides context for the `useSpaces` hook
 *
 * Renders children inside of a styled div with relevant style variables defined
 */
export function ProvideSpaces({
  spaces,
  children,
}: PropsWithChildren<{ spaces: Context }>) {
  const styles = getSpaceStyles(spaces.active)

  return (
    <Context.Provider value={spaces}>
      <div style={styles}>{children}</div>
    </Context.Provider>
  )
}

export function SpaceTheme({
  space,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  /**
   * ID of space to use. Will be resolved from the {@link ProvideSpaces}
   */
  space: string
}) {
  const { all: spaces } = useSpaces()

  const found = spaces.find((s) => s.id === space)

  const styles = getSpaceStyles(found)

  console.log("use spaces", useSpaces())

  return (
    <div {...props} style={{ ...styles, ...props.style }}>
      {children}
    </div>
  )
}
/**
 * Access the space provided by {@link ProvideSpaces}
 */
export const useSpaces = () => useContext(Context)

type SpaceStyles = CSSProperties & {
  "--space"?: `#${string}`
}

/**
 * Get the CSS style variables for a space as a CSSProperties object
 */
const getSpaceStyles = (space?: Space) =>
  ({
    "--space": space?.color,
  }) as SpaceStyles
