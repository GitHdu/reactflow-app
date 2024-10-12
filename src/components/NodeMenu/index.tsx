// Sidebar.js
import { Button, Card } from "antd";

function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card title='Node Types' style={{ width: 200 }}>
      <Button
        type='primary'
        draggable
        onDragStart={(event) => onDragStart(event, "custom")}
        style={{ marginBottom: 8, width: "100%" }}
      >
        Custom Node
      </Button>
    </Card>
  );
}

export default Sidebar;
