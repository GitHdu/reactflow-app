import NodeMenu from "@/components/NodeMenu";

import { FlowEditorProvider } from "@/components/FlowEditor";
import { Layout } from "antd";
import Flow from "./flow";
const { Sider, Content } = Layout;

export default function HomePage() {
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <FlowEditorProvider>
          <Flow>
            <div
              style={{
                width: 200,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 999,
                bottom: 0
              }}
            >
              <NodeMenu />
            </div>
          </Flow>
        </FlowEditorProvider>
      </Layout>
    </div>
  );
}
