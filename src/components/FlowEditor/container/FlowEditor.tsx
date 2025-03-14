import { createStyles, cx } from "antd-style";
import isEqual from "fast-deep-equal";
import { debounce } from "lodash-es";
import {
  JSXElementConstructor,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import { Flexbox } from "react-layout-kit";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  NodeTypes,
  SelectionMode,
  Viewport,
  useNodesInitialized,
  useOnViewportChange,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";

import CanvasLoading from "@/components/CanvasLoading";
import ContextMenu from "../features/ContextMenu";
import ControlAction from "../features/ControlAction";
import { FlowEditorInstance, useFlowEditor } from "../hooks/useFlowEditor";
import { useHotkeyManager } from "../hooks/useHotkeyManager";
import { flowEditorSelectors, useStore } from "../store";

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    background: ${token.colorBgLayout};

    -webkit-font-smoothing: antialiased;

    .react-flow__pane {
      cursor: default;
    }
    .react-flow__edge-path,
    .react-flow__connection-path {
      stroke: ${token.colorBorder};
      stroke-width: 3px;
    }

    .react-flow__edge.selected .react-flow__edge-path,
    .react-flow__edge:focus .react-flow__edge-path,
    .react-flow__edge:focus-visible .react-flow__edge-path {
      stroke: ${token.colorPrimary};
      stroke-width: 4px;
    }
  `,
  minimap: css`
    overflow: hidden;
    height: 150px;
    background: ${token.colorBgContainer};
    border-radius: 4px;
  `
}));

type ComponentProps<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = T extends JSXElementConstructor<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : Record<string, never>;

export interface FlowEditorAppProps {
  nodeTypes?: NodeTypes;
  defaultViewport?: Viewport;
  contextMenuEnabled?: boolean;
  onNodesInit?: (editor: FlowEditorInstance) => void;
  onNodesInitChange?: (init: boolean) => void;

  // nodes 事件
  // beforeNodesChange?: (changes: NodeChange[]) => boolean;
  // onNodesChange?: (changes: NodeChange[]) => void;
  // afterNodesChange?: (changes: NodeChange[]) => void;
  // edges 事件
  // beforeEdgesChange?: (changes: EdgeChange[]) => boolean;
  // onEdgesChange?: (changes: EdgeChange[]) => void;
  // afterEdgeChange?: (changes: EdgeChange[]) => void;
  // connection 事件
  beforeConnect?: (connection: Connection) => boolean;
  onConnect?: (connection: Connection) => void;
  afterConnect?: (edge: Edge) => void;

  style?: React.CSSProperties;
  flowProps?: ComponentProps<typeof ReactFlow>;
  className?: string;
  children?: React.ReactNode;
  background?: boolean;
  miniMap?: boolean;
  hotkeyManager?: boolean;
}

const FlowEditor = forwardRef<any, FlowEditorAppProps>(
  (
    {
      nodeTypes,
      contextMenuEnabled = false,
      style,
      className,
      flowProps,
      defaultViewport,
      children,
      background = true,
      miniMap = true,
      hotkeyManager = true,
      onNodesInit,

      beforeConnect = () => true,
      onConnect = () => {},
      afterConnect = () => {}
    },
    ref
  ) => {
    const { theme, styles } = useStyles();

    const nodes: Node[] = useStore(flowEditorSelectors.nodeList, isEqual);
    const edges = useStore(flowEditorSelectors.edgeList, isEqual);
    const editor = useFlowEditor();

    const nodesInitialized = useNodesInitialized();
    const firstRender = useRef(false);

    const flowInit = useMemo(() => {
      if (nodesInitialized) {
        return true;
      }

      if (nodes.length > 0) {
        return false;
      } else {
        return true;
      }
    }, [nodes, nodesInitialized]);

    const [
      handleNodesChange,
      handleEdgesChange,
      updateEdgesOnConnection,
      onViewPortChange
      // onEdgesChange,
    ] = useStore((s) => [
      s.handleNodesChange,
      s.handleEdgesChange,
      s.updateEdgesOnConnection,
      s.onViewPortChange
      // s.onEdgesChange,
    ]);

    const instance = useReactFlow();

    // 添加快捷键监听
    useHotkeyManager(hotkeyManager);

    // 抛出 viewport 变化的事件
    useOnViewportChange({
      onChange: onViewPortChange ? debounce(onViewPortChange, 300) : undefined
    });

    useEffect(() => {
      if (firstRender.current) {
        return;
      }
      firstRender.current = true;
      // 先把画布的 viewport 设置好
      if (!defaultViewport) {
        instance.fitView({
          minZoom: 0.8,
          maxZoom: 0.8
        });
      } else {
        instance.setViewport(defaultViewport);
      }
    }, [nodesInitialized]);

    useEffect(() => {
      if (nodesInitialized) {
        onNodesInit?.(editor);
      }
    }, [nodesInitialized]);

    const handleConnect = useCallback(
      (connection: Connection) => {
        if (!beforeConnect(connection)) {
          return;
        }

        if (onConnect) {
          onConnect(connection);
        }

        const edge = updateEdgesOnConnection(connection);

        if (afterConnect && edge) {
          afterConnect(edge);
        }
      },
      [onConnect, beforeConnect, afterConnect]
    );

    return (
      <Flexbox height={"100%"} width={"100%"} style={{ position: "relative" }}>
        {!flowInit && <CanvasLoading />}
        <ReactFlow
          nodeTypes={nodeTypes}
          ref={ref}
          className={cx(styles.container, className)}
          // 如果外部传入 viewport，则使用外部的 viewport
          defaultViewport={defaultViewport}
          // 否则就 fit view
          fitView={!defaultViewport}
          fitViewOptions={{ padding: 3 }}
          nodes={nodes}
          edges={edges}
          // snapToGrid
          snapGrid={[20, 20]}
          minZoom={0.05}
          // 画布配置逻辑
          panOnScroll
          panOnDrag={false}
          zoomOnScroll={false}
          elevateEdgesOnSelect
          selectionOnDrag
          style={style}
          {...flowProps}
          // 选择模式逻辑
          selectionMode={SelectionMode.Partial}
          selectionKeyCode={["Meta", "Shift"]}
          multiSelectionKeyCode={["Meta", "Shift"]}
          selectNodesOnDrag
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          // Connect 相关逻辑
          onConnect={handleConnect}
          disableKeyboardA11y={true}
          proOptions={{ hideAttribution: true }}
        >
          {background && (
            <Background
              color={theme.colorTextQuaternary}
              variant={BackgroundVariant.Dots}
              size={2}
            />
          )}

          {miniMap && <ControlAction />}
          {contextMenuEnabled && <ContextMenu />}
          {children}
        </ReactFlow>
      </Flexbox>
    );
  }
);

export default FlowEditor;
