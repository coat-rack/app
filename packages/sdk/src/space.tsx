import { Space } from "@repo/data/models"
import {
  createContext,
  CSSProperties,
  PropsWithChildren,
  useContext,
} from "react"

interface SpaceContext {
  space?: Space
}

const Context = createContext<SpaceContext>({})

/**
 * Renders children inside of a styled div with relevant style variables defined
 */
export function ProvideSpace({
  space,
  children,
}: PropsWithChildren<SpaceContext>) {
  const styles = getSpaceStyles(space)

  return <div style={styles}>{children}</div>
}

/**
 * Access the space provided by {@link ProvideSpace}
 */
export const useSpace = () => useContext(Context)?.space

type SpaceStyles = CSSProperties & {
  "--primary"?: `#${string}`
}

/**
 * Get the CSS style variables for a space as a CSSProperties object
 */
export const getSpaceStyles = (space?: Space) =>
  ({
    "--primary": space?.color,
  }) as SpaceStyles

/**
 * Merge a style object with relevant CSS properties from the space provided.
 */
export const withSpaceStyles = (
  styles: CSSProperties = {},
  space?: Space,
): SpaceStyles => ({
  ...getSpaceStyles(space),
  ...styles,
})
