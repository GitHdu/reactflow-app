import CustomEdge from "@/components/CustomEdge";
import CustomNode from "@/components/CustomNode";
import { FlowEditor, useFlowEditor } from "@/components/FlowEditor";
import { useCallback } from "react";
import { MarkerType } from "reactflow";

const nodeTypes = {
  custom: CustomNode
};
const edgeTypes = {
  custom: CustomEdge
};
interface FlowProps {
  children?: React.ReactNode;
}
export default (props: FlowProps) => {
  const { children } = props;
  const editor = useFlowEditor();
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const position = editor.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      const newNode = {
        id: Date.now().toString(),
        type,
        position,
        content: {
          a: "123"
        },
        data: {
          title: `${type} node`,
          content: "123"
        }
      };
      editor.addNode(newNode);
    },
    [editor]
  );

  return (
    <FlowEditor
      nodeTypes={nodeTypes}
      defaultViewport={editor.viewport}
      flowProps={{
        onDragOver,
        onDrop,
        edgeTypes,

        defaultEdgeOptions: {
          type: "custom",
          markerEnd: {
            type: MarkerType.ArrowClosed
          },
          style: {
            strokeWidth: 2
          }
        }
      }}
      devtools
    >
      {children}
    </FlowEditor>
  );
};
