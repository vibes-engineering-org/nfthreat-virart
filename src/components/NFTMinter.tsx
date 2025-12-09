"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { base } from "wagmi/chains";
import { type Address } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Loader2, Wallet, ExternalLink } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import { detectNFTProvider, validateParameters } from "~/lib/provider-detector";
import { optimizePrice } from "~/lib/price-optimizer";
import { getProviderConfig } from "~/lib/provider-configs";
import { formatEther } from "viem";
import type { NFTContractInfo, MintParams } from "~/lib/types";

interface NFTMinterState {
  contractAddress: string;
  amount: number;
  isLoading: boolean;
  contractInfo: NFTContractInfo | null;
  mintPrice: bigint | null;
  isValidating: boolean;
  validationErrors: string[];
}

export default function NFTMinter() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [state, setState] = useState<NFTMinterState>({
    contractAddress: "",
    amount: 1,
    isLoading: false,
    contractInfo: null,
    mintPrice: null,
    isValidating: false,
    validationErrors: [],
  });

  // Validate and detect contract when address changes
  useEffect(() => {
    if (state.contractAddress.length === 42 && state.contractAddress.startsWith("0x")) {
      validateContract();
    } else {
      setState(prev => ({
        ...prev,
        contractInfo: null,
        mintPrice: null,
        validationErrors: [],
      }));
    }
  }, [state.contractAddress]);

  const validateContract = async () => {
    setState(prev => ({ ...prev, isValidating: true, validationErrors: [] }));

    try {
      const mintParams: MintParams = {
        contractAddress: state.contractAddress as Address,
        chainId: base.id,
        amount: state.amount,
        recipient: address,
      };

      const contractInfo = await detectNFTProvider(mintParams);
      const validation = validateParameters(mintParams, contractInfo);

      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          isValidating: false,
          validationErrors: [...validation.errors, ...validation.missingParams.map(p => `Missing: ${p}`)],
          contractInfo,
        }));
        return;
      }

      // Get mint price
      let mintPrice: bigint | null = null;
      try {
        const price = await optimizePrice({
          ...mintParams,
          contractInfo,
        });
        mintPrice = price.totalCost;
      } catch (error) {
        console.warn("Could not fetch mint price:", error);
      }

      setState(prev => ({
        ...prev,
        isValidating: false,
        contractInfo,
        mintPrice,
        validationErrors: [],
      }));

      toast({
        title: "Contract Validated",
        description: `Detected ${contractInfo.provider} NFT contract`,
      });
    } catch (error) {
      console.error("Contract validation error:", error);
      setState(prev => ({
        ...prev,
        isValidating: false,
        validationErrors: ["Failed to validate contract. Please check the address."],
      }));
    }
  };

  const handleMint = async () => {
    if (!isConnected || !address || !walletClient || !state.contractInfo) {
      toast({
        title: "Error",
        description: "Please connect your wallet and validate a contract first.",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const mintParams: MintParams = {
        contractAddress: state.contractAddress as Address,
        chainId: base.id,
        amount: state.amount,
        recipient: address,
      };

      const config = getProviderConfig(state.contractInfo.provider, state.contractInfo);
      const args = config.mintConfig.buildArgs(mintParams);

      const value = state.mintPrice
        ? config.mintConfig.calculateValue(state.mintPrice, mintParams)
        : 0n;

      const hash = await walletClient.writeContract({
        address: state.contractAddress as Address,
        abi: config.mintConfig.abi,
        functionName: config.mintConfig.functionName,
        args,
        value,
        chain: base,
      });

      toast({
        title: "Transaction Submitted",
        description: (
          <div className="flex items-center gap-2">
            <span>Minting {state.amount} NFT(s)...</span>
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ),
      });

      // Wait for confirmation
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === "success") {
          toast({
            title: "Mint Successful!",
            description: `Successfully minted ${state.amount} NFT(s)`,
          });
        } else {
          throw new Error("Transaction failed");
        }
      }
    } catch (error: any) {
      console.error("Mint error:", error);
      toast({
        title: "Mint Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const canMint = isConnected &&
                  state.contractInfo &&
                  state.validationErrors.length === 0 &&
                  !state.isValidating &&
                  !state.isLoading;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">NFT Minter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract Address Input */}
          <div className="space-y-2">
            <Label htmlFor="contract">Contract Address</Label>
            <Input
              id="contract"
              placeholder="0x..."
              value={state.contractAddress}
              onChange={(e) => setState(prev => ({ ...prev, contractAddress: e.target.value }))}
              className="font-mono text-sm"
            />
            {state.isValidating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating contract...
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Mint</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={state.amount}
              onChange={(e) => setState(prev => ({ ...prev, amount: parseInt(e.target.value) || 1 }))}
            />
          </div>

          {/* Contract Info Display */}
          {state.contractInfo && state.validationErrors.length === 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2">
              <div className="text-sm font-medium text-green-800 dark:text-green-200">
                Contract Validated ✓
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                <div>Provider: {state.contractInfo.provider}</div>
                <div>Type: {state.contractInfo.isERC721 ? "ERC721" : state.contractInfo.isERC1155 ? "ERC1155" : "Unknown"}</div>
                {state.mintPrice && (
                  <div>Price per NFT: {formatEther(state.mintPrice)} ETH</div>
                )}
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {state.validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Validation Errors
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
                {state.validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </div>
          )}

          {/* Connect Wallet / Mint Button */}
          {!isConnected ? (
            <Button className="w-full" disabled>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet First
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={handleMint}
              disabled={!canMint}
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                `Mint ${state.amount} NFT${state.amount > 1 ? "s" : ""}`
              )}
            </Button>
          )}

          {/* Price Display */}
          {state.mintPrice && canMint && (
            <div className="text-center text-sm text-muted-foreground">
              Total Cost: {formatEther(state.mintPrice * BigInt(state.amount))} ETH
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Enter any NFT contract address on Base</li>
              <li>Click Mint to mint with 2 clicks</li>
            </ol>
            <p className="text-xs pt-2">
              Supports Manifold, thirdweb, NFTs2Me, and generic ERC721/ERC1155 contracts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}