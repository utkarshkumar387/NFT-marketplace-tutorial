import { useMoralis, useNativeBalance } from "react-moralis";

function NativeBalance(props) {
  const { account, isAuthenticated } = useMoralis();
  const { data: balance } = useNativeBalance(props);

  if (!account || !isAuthenticated) return null;
  return (
    <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
      {balance.formatted}
    </div>
  );
}

export default NativeBalance;
