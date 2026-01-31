"use client"

import * as React from "react"
import {
  Root,
  Legend as RechartsLegend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import type {
  AxisProps,
  LegendProps,
  TooltipProps,
  ResponsiveContainerProps,
} from "recharts"

import { cn } from "@/lib/utils"

// #region Chart Types
type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig
  children: React.ReactNode
}

type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
}
// #endregion

// #region Chart Context
type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}
// #endregion

// #region ChartContainer
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ id, className, children, config, ...props }, ref) => {
  const chartId = `chart-${id || React.useId()}`
  const { CHART_COLORS, CHART_THEME } = React.useMemo(() => {
    let CHART_THEME: {
      [key in keyof typeof config]: string
    } = {}
    let CHART_COLORS: {
      [key in keyof typeof config]: string
    } = {}

    for (const key in config) {
      const configValue = config[key]
      if (configValue) {
        if (configValue.theme) {
          CHART_THEME[key] =
            `var(--theme-${Object.keys(configValue.theme)[0]})`
        } else if (configValue.color) {
          CHART_COLORS[key] = configValue.color
        }
      }
    }

    return { CHART_COLORS, CHART_THEME }
  }, [config])

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-dot_path]:stroke-background [&_.recharts-layer:focus-visible]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-radial-bar-background-sector]:stroke-border [&_.recharts-reference-line_line]:stroke-border [&_.recharts-tooltip-cursor]:stroke-border [&_tspan]:fill-muted-foreground",
          className
        )}
        {...props}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
[data-chart=${chartId}] {
${Object.entries(CHART_THEME)
  .map(([key, value]) => `--theme-${key}: ${value};`)
  .join("\n")}
}
`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
[data-chart=${chartId}] {
${Object.entries(CHART_COLORS)
  .map(([key, value]) => `--color-${key}: ${value};`)
  .join("\n")}
}
`,
          }}
        />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"
// #endregion

// #region ChartLegend
const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<LegendProps, "payload" | "verticalAlign"> & {
      name?: string
      hideIcon?: boolean
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", name },
    ref
  ) => {
    const { config } = useChart()

    return (
      <div
        ref={ref}
        data-name={name || "legend"}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "mb-4" : "mt-4",
          className
        )}
      >
        {payload?.map((item) => {
          const key = item.value?.toString()
          const itemConfig = config[key]
          const SvgIcon = itemConfig?.icon

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground"
              )}
            >
              {item.color && !hideIcon && (
                <div
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.icon && <SvgIcon />}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegend.displayName = "ChartLegend"
// #endregion

// #region ChartLegendContent
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<LegendProps, "payload" | "verticalAlign"> & {
      name?: string
    }
>(
  (
    { className, payload, verticalAlign = "bottom", name, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "mb-4" : "mt-4",
          className
        )}
        {...props}
      >
        <RechartsLegend
          content={
            <ChartLegend payload={payload} name={name} hideIcon={false} />
          }
        />
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"
// #endregion

// #region ChartTooltip
const ChartTooltip = RechartsTooltip
// #endregion

// #region ChartTooltipContent
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<
      TooltipProps<any, any>,
      "label" | "labelClassName" | "payload" | "separator"
    > & {
      indicator?: "line" | "dot" | "dashed"
      hideLabel?: boolean
      hideIndicator?: boolean
      name?: string
      labelFormatter?: TooltipProps<any, any>["formatter"]
      formatter?: TooltipProps<any, any>["formatter"]
    }
>(
  (
    {
      className,
      label,
      labelClassName,
      payload,
      separator = ": ",
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      name,
      formatter,
      labelFormatter,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      if (labelFormatter) {
        return labelFormatter(label, payload)
      } else {
        return label
      }
    }, [label, payload, hideLabel, labelFormatter])

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        data-name={name || "tooltip"}
        className={cn(
          "grid min-w-32 items-stretch gap-1.5 rounded-lg border bg-background p-2.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && tooltipLabel ? (
          <div className={cn("font-medium", labelClassName)}>
            {tooltipLabel}
          </div>
        ) : null}
        <div className="grid gap-1.5">
          {payload.map((item, i) => {
            const key = item.name || item.dataKey?.toString()
            const itemConfig = key ? config[key] : undefined
            const SvgIcon = itemConfig?.icon
            const indicatorColor = item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground",
                  i < payload.length - 1 && "border-b border-border/50 pb-1.5"
                )}
              >
                {itemConfig?.icon && <SvgIcon />}
                {!hideIndicator && (
                  <div
                    className={cn(
                      "shrink-0",
                      {
                        "w-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed":
                          indicator === "dashed",
                      },
                      { "border-primary": indicator === "dashed" }
                    )}
                  >
                    {indicator === "dot" && (
                      <div
                        className="size-2.5 rounded-full"
                        style={{
                          background: indicatorColor,
                        }}
                      />
                    )}
                  </div>
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    item.name && "gap-1.5"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium">
                      {formatter
                        ? formatter(item.value, item.name, item, i, payload)
                        : item.value}
                    </p>
                    {item.name && !formatter ? (
                      <span className="text-muted-foreground">
                        {separator}
                        {itemConfig?.label || item.name}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"
// #endregion

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartContext,
  type ChartConfig,
  useChart,
}
