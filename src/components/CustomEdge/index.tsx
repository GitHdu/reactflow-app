import { DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import {
  BezierEdge,
  BezierEdgeProps,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath
} from "reactflow";
import { useFlowEditor } from "../FlowEditor/hooks/useFlowEditor";

const CustomEdge: React.FC<EdgeProps> = (props: BezierEdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    style = {},
    markerEnd
  } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  const editor = useFlowEditor();

  return (
    <g id={id}>
      <BezierEdge {...props} />

      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
              zIndex: 1000
            }}
            className='nodrag nopan'
          >
            <Tooltip
              placement='top'
              title='删除该条边？'
              overlayInnerStyle={{ color: "black", fontSize: "12px" }}
              color='white'
            >
              <DeleteOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  editor.deleteEdge(id);
                }}
              />
            </Tooltip>
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  );
};

export default CustomEdge;
