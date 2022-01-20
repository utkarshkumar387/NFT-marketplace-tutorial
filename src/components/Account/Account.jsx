import { Button } from "antd";
const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
  connector: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "20px 5px",
    cursor: "pointer",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    height: "30px",
  },
};

function Account() {
  return (
    <>
      <div>
        <p style={styles.text}>Authenticate</p>
      </div>
    </>
  );

  return (
    <>
      <div style={styles.account}>
        <p style={{ marginRight: "5px", ...styles.text }}>
          0xa890f3Fa407576E6649D488091eB91CAE48d872g
        </p>
      </div>
      <Button
        size="large"
        type="primary"
        style={{
          width: "100%",
          borderRadius: "0.5rem",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        Disconnect Wallet
      </Button>
    </>
  );
}

export default Account;
