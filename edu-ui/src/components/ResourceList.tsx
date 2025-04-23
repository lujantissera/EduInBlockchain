import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import {readContract} from "viem";
import { EDU_CONTRACT_ABI, EDU_CONTRACT_ADDRESS } from "../config/contract";

const ResourceList = {} => {
    const publicClient = usePublicClient();
    const [resources, setResources] = useState<any[]>([]);
}