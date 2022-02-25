import { useLocation } from "react-router";
import { Menu } from "antd";
import { Link } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/">
        <Link to="/Home">Home</Link>
      </Menu.Item>
      <Menu.Item key="/myNFT">
        <Link to="/myNFT">My NFT</Link>
      </Menu.Item>
      <Menu.Item key="/createdNFT">
        <Link to="/createdNFT">Created NFT</Link>
      </Menu.Item>
      <Menu.Item key="/Create">
        <Link to="/Create">Create</Link>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
