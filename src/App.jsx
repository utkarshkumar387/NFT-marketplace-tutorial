import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import nftabi from "./eSamudaayNFT_abi.json";
import nftmarketabi from "./eSamudaayNFTMarket.json";
import { ethers } from "ethers";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Account from "./components/Account/Account";
import Chains from "./components/Chains/Chains";
import { Layout, message } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "./components/NativeBalance";
import Create from "./components/Create";
import Home from "./components/Home";
import CreatedNFT from "./components/CreatedNFT";
import MyNFT from "./components/MyNFT";
import MenuItems from "./components/MenuItems";
import Modal from "antd/lib/modal/Modal";
import { nftaddress, nftmarketaddress } from "./config";
const { Header } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = () => {
  const {
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    isWeb3EnableLoading,
    Moralis,
  } = useMoralis();
  const [selectedImage, setSelectedImage] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftAmount, setNftAmount] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  let history = useHistory();

  const handleSetNftDescription = (desc) => {
    setNftDescription(desc);
  };

  const handleSetNftName = (name) => {
    setNftName(name);
  };

  const handleSetSelectedImage = (image) => {
    setSelectedImage(image);
  };

  const handleSetNftAmount = (amount) => {
    setNftAmount(amount);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const inputValidations = () => {
    if (!nftName) {
      message.info("Please insert nft name");
      return false;
    } else if (!nftDescription) {
      message.info("Please insert nft description");
      return false;
    } else if (!selectedImage) {
      message.info("Please insert nft image");
      return false;
    } else if (!nftAmount) {
      message.info("Please insert nft Amount");
      return false;
    }
    return true;
  };
  const uploadDataOnIpfs = async () => {
    let imageFile;
    let metadataURI;
    if (selectedImage) {
      imageFile = new Moralis.File(selectedImage.name, selectedImage);

      await imageFile.saveIPFS();
      const imageURI = imageFile.ipfs();
      const metadata = {
        name: nftName,
        description: nftDescription,
        image: imageURI,
      };
      const metadataFile = new Moralis.File("metadata.json", {
        base64: btoa(JSON.stringify(metadata)),
      });
      await metadataFile.saveIPFS();
      metadataURI = metadataFile.ipfs();
      const txt = await mintToken(metadataURI);
    }
    console.log(`meta data uri => ${metadataURI}`);
  };
  const mintToken = async (_uri) => {
    try {
      const { ethereum } = window;
      console.log(`ethereum is ${window.ethereum}`);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        let connectedContract = new ethers.Contract(
          nftaddress,
          nftabi.abi,
          signer
        );
        let nftTxn = await connectedContract.createToken(_uri);
        let txn = await nftTxn.wait();
        let event = txn.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();
        const price = ethers.utils.parseUnits(nftAmount, "ether");
        connectedContract = new ethers.Contract(
          nftmarketaddress,
          nftmarketabi.abi,
          signer
        );
        let listingPrice = await connectedContract.getListingPrice();
        listingPrice = listingPrice.toString();
        //create nft item
        nftTxn = await connectedContract.createMarketItem(
          nftaddress,
          tokenId,
          price,
          {
            value: listingPrice,
          }
        );
        await nftTxn.wait();
        if (nftTxn) {
          setIsModalVisible(true);
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleMintNft = () => {
    if (inputValidations()) {
      uploadDataOnIpfs();
    } else {
      console.log("insert required data");
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
  }, [isAuthenticated, isWeb3Enabled, isWeb3EnableLoading]);
  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Modal visible={isModalVisible} onOk={handleOk}>
        <h3>Your NFT is listed successfully!!</h3>
        <h3>Please navigate to home to view it.</h3>
      </Modal>
      <Router>
        <Header style={styles.header}>
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/Home">
              <Home />
            </Route>
            <Route path="/myNFT">
              <MyNFT />
            </Route>
            <Route path="/createdNFT">
              <CreatedNFT />
            </Route>
            <Route path="/Create">
              <Create
                onHandleSetNftDescription={handleSetNftDescription}
                onHandleSetNftName={handleSetNftName}
                onHandleSetSelectedImage={handleSetSelectedImage}
                onHandleMintNft={handleMintNft}
                selectedImage={selectedImage}
                nftName={nftName}
                nftDescription={nftDescription}
                nftAmount={nftAmount}
                onHandleSetNftAmount={handleSetNftAmount}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    </Layout>
  );
};

export default App;
