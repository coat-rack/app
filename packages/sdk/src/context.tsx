import {
  createContext,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react"
import type { AppContext, Space } from "./types"

const Context = createContext<AppContext>({} as unknown as AppContext)

/**
 * Provides context for the {@link useAppContext} hook. This will be provided by
 * platform. As long as components are rendered within the normal context this
 * will not need to be used by apps.
 *
 * > Renders children inside of a styled div with relevant style variables defined
 */
export const ProvideAppContext = <T,>({
  children,
  db,
  spaces,
  activeSpace,
}: PropsWithChildren<AppContext<T>>) => {
  const styles = getSpaceStyles(activeSpace)

  return (
    <Context.Provider
      value={{
        db,
        spaces,
        activeSpace,
      }}
    >
      <div style={styles}>{children}</div>
    </Context.Provider>
  )
}

/**
 * Access the app context provided by {@link ProvideAppContext}
 */
export const useAppContext = <T,>() => {
  const context = useContext<AppContext<T>>(Context)

  if (!context) {
    throw new Error(
      "useAppContext should only be called from within ProvideAppContext",
    )
  }

  return context
}

type ProvideSpaceWrapperProps<
  El extends keyof HTMLElementTagNameMap | undefined,
> = El extends keyof HTMLElementTagNameMap
  ? HTMLAttributes<HTMLElementTagNameMap[El]> & {
      as?: El
      /**
       * ID of space to use. Will be resolved from the {@link ProvideAppContext}
       */
      space?: string
    }
  : HTMLAttributes<HTMLDivElement> & {
      space?: string
      as?: undefined
    }

interface SpaceContext {
  space?: Space
}

const SpaceContext = createContext<SpaceContext>({})

/**
 * Provide styles and context for the relevant space. The context can be
 * accessed by internal components using the {@link useSpace} hook
 */
export const ProvideSpace = <
  El extends keyof HTMLElementTagNameMap | undefined = undefined,
>({
  space,
  children,
  as: tagName,
  ...props
}: ProvideSpaceWrapperProps<El>) => {
  const { spaces } = useAppContext()

  const found = spaces.find((s) => s.id === space)

  const styles = getSpaceStyles(found)

  const Tag = tagName || "div"

  return (
    <SpaceContext.Provider value={{ space: found }}>
      <Tag {...(props as any)} style={{ ...styles, ...props.style }}>
        {children}
      </Tag>
    </SpaceContext.Provider>
  )
}

/**
 * Access the space provided by {@link ProvideSpace}
 */
export const useSpace = () => {
  const { space } = useContext(SpaceContext)

  return space
}

export type SpaceStyles = CSSProperties & {
  "--space"?: `#${string}`
}

/**
 * Get the CSS style variables for a space as a CSSProperties object
 */
export const getSpaceStyles = (space?: Space) =>
  ({
    "--space": space?.color,
  }) as SpaceStyles
