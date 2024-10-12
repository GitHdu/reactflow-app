import NodeMenu from "@/components/NodeMenu";

import { FlowEditorProvider } from "@/components/FlowEditor";
import { Layout } from "antd";
import Flow from "./flow";
const { Sider, Content } = Layout;

export default function HomePage() {
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <Sider width={200} theme='light'>
          <NodeMenu />
        </Sider>
        <Content>
          <FlowEditorProvider>
            <Flow />
          </FlowEditorProvider>
        </Content>
      </Layout>
    </div>
  );
}
