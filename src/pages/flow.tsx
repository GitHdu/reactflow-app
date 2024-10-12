import CustomNode from "@/components/CustomNode";
import { FlowEditor, useFlowEditor } from "@/components/FlowEditor";
import { useCallback } from "react";
const nodeTypes = {
  custom: CustomNode
};
export default () => {
  const editor = useFlowEditor();
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const position = { x: event.clientX - 200, y: event.clientY };
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
      flowProps={{ onDragOver, onDrop }}
    ></FlowEditor>
  );
};
