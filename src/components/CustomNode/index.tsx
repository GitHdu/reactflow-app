import { Card } from "antd";
import { useEffect } from "react";
import { Handle, NodeToolbar, Position } from "reactflow";
import { CustomNodeProps, useFlowEditor } from "../FlowEditor";

const CustomRender = (node: CustomNodeProps<any>) => {
  const { data, selected } = node;
  console.log("🚀 ~ node:", node);
  const editor = useFlowEditor();

  useEffect(() => {
    setTimeout(() => {
      editor.updateNodeData(node.id, {
        content: "cesss"
      });
    }, 3000);
  }, [editor, node.id]);

  return (
    <Card
      size='small'
      title={data.content}
      style={{ width: 150, border: selected ? "1px solid red" : "none" }}
    >
      <NodeToolbar>
        <button onClick={() => editor.copySelection()}>copy</button>
        <button onClick={() => editor.deleteNode(node.id)}>删除</button>
      </NodeToolbar>
      <Handle type='target' position={Position.Left} />
      <p>{data.content}</p>
      <Handle type='source' position={Position.Right} />
    </Card>
  );
};

export default CustomRender;
