import React from "react";
import { useMoralis } from "react-moralis";
import { Form, Input, Button, Card } from "antd";

function Create({
  onHandleSetNftDescription,
  onHandleSetNftName,
  onHandleSetSelectedImage,
  onHandleMintNft,
  nftName,
  nftDescription,
  selectedImage,
  nftAmount,
  onHandleSetNftAmount,
}) {
  const { authenticate, isAuthenticated, account } = useMoralis();

  const submitButton = () => {
    return (
      <Button
        type="primary"
        style={{
          borderRadius: "0.5rem",
          fontSize: "16px",
          fontWeight: "500",
        }}
        onClick={() => onHandleMintNft()}
      >
        Submit
      </Button>
    );
  };
  const connectWalletButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        style={{
          borderRadius: "0.5rem",
          fontSize: "16px",
          fontWeight: "500",
        }}
        onClick={async () => {
          try {
            await authenticate();
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Connect Wallet
      </Button>
    );
  };
  return (
    <div>
      <Card
        style={{ width: "100%" }}
        title="Create your own NFT"
        bordered={false}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="Name"
            value={nftName}
            onChange={(event) => {
              onHandleSetNftName(event.target.value);
            }}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="Description"
            value={nftDescription}
            onChange={(event) => {
              onHandleSetNftDescription(event.target.value);
            }}
            rules={[{ required: true }]}
          >
            <Input inputFieldView />
          </Form.Item>

          <Form.Item label="Image" name="Image" rules={[{ required: true }]}>
            <input
              type="file"
              name="myImage"
              value={selectedImage}
              onChange={(event) => {
                onHandleSetSelectedImage(event.target.files[0]);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="Amount"
            value={nftAmount}
            onChange={(event) => {
              onHandleSetNftAmount(event.target.value);
            }}
            rules={[{ required: true }]}
          >
            <Input inputFieldView />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            {!isAuthenticated || !account
              ? connectWalletButton()
              : submitButton()}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Create;
