import { ConnectWallet, Web3Button } from "@thirdweb-dev/react";
import "./styles/Home.css";
import { useContract, useContractWrite, useAddress, useClaimedNFTSupply, useUnclaimedNFTSupply, useActiveClaimConditionForWallet } from "@thirdweb-dev/react";
import preview from "./images/preview.gif"
import { useState } from "react";
const nftDropContractAddress = "0xe6F62bA51429c1293eb9B806e44474ba93806cDA";

function Home() {

  const { contract: nftDrop } = useContract(nftDropContractAddress);
  const address = useAddress();

  console.log("address", address);

  const [quantity, setQuantity] = useState(1);

  const unclaimedSupply = useUnclaimedNFTSupply(nftDrop);
  const claimedSupply = useClaimedNFTSupply(nftDrop);

  const activeClaimCondition = useActiveClaimConditionForWallet(nftDrop, address);

  console.log("activeClaimCondition", activeClaimCondition?.data?.currencyMetadata.displayValue);

  console.log("unclaimedSupply", Number(unclaimedSupply.data));

  console.log("claimedSupply", Number(claimedSupply.data));

  return (
    <div className="container">
      <main className="mintInfoContainer">
        <div className="imageSide">
          <img
            className="image"
            src={preview}
            alt="Emoji faces NFT Preview"
          />
        </div>

        <div className="mintCompletionArea">
          <div className="mintAreaLeft">
            <h2>Total Minted</h2>
          </div>

          <div className="mintAreaRight">
            <p>
              <b>{Number(claimedSupply.data)}/{Number(unclaimedSupply?.data) + Number(claimedSupply?.data)} </b>
            </p>
          </div>

          <div>
            <h2>Quantity</h2>
            <div className="quantityContainer">
              <button
                className="quantityControlButton"
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <h4>{quantity}</h4>
              <button
                className="quantityControlButton"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= Number(activeClaimCondition.data?.maxClaimablePerWallet)}
              > + </button>
            </div>
          </div>
        </div>

        <div className="mintContainer">
          {Number(unclaimedSupply?.data) + Number(claimedSupply?.data)
           == Number(claimedSupply.data) ?
            <div>
              <h2>Sold Out!!!!</h2>
            </div> :
            <Web3Button
              contractAddress={nftDropContractAddress}
              action={(contract) => contract.erc721.claim(quantity)}
              onError={(err) => {
                alert("Error minting NFTs", err.message);
              }}
              onSuccess={() => {
                alert("Succesfully minted NFT");
              }}
            >
              Mint NFT ({Number(activeClaimCondition?.data?.currencyMetadata.displayValue) * quantity}
              {" "}{activeClaimCondition?.data?.currencyMetadata.symbol})
            </Web3Button>
          }

        </div>
      </main>
    </div>
  );
}

export default Home;