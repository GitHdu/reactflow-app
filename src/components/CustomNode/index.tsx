import { FC } from "react";
import { Handle, Position } from "reactflow";

const StringRender: FC = (node: any) => {
  const { handles, id } = node;

  return (
    <div>
      <Handle
        id={typeof handles?.source === "string" ? handles?.source : id}
        type={"target"}
        position={Position.Left}
      />
      {node.data.title}
      <Handle
        id={typeof handles?.source === "string" ? handles?.source : id}
        type={"source"}
        position={Position.Right}
      />
    </div>
  );
};

export default StringRender;
