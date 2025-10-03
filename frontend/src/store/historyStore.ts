import { create } from "zustand";
import api from "../utils/axios";

export interface HistoryPayload {
  token: string;
  size: string; 
  boardState: string; 
}
export interface ReplayData{
    id: string;
    token: string;
    size: number;
    boardState: string;
}

interface HistoryStore {
    loading: boolean;
    myHistory: string[];
    // selectedBoardId: string | "";
    error: string | null;
    board: {
        id: string;
        token: string;
        size: number;
        history: (null | "X" | "O")[][];
        step: number;
    } | null;
    replayData: ReplayData | null;

    historyList: (token: string) => Promise<void>;
    insertHistory: (historyPayload: HistoryPayload) => Promise<void>;
    onSelectHistory: (boardId: string) => Promise<void>;
    clearReplayData: () => void;
}

export const useMyHistoryStore = create<HistoryStore>((set) => ({
    loading: false,
    myHistory: [],
    board: null,
    error: null,
    replayData: null,

    clearReplayData: () => set({ replayData: null }),
    onSelectHistory: async (boardId: string) => {
        set({ loading: true, error: null });
        try{
            const current = useMyHistoryStore.getState().replayData;
            if(current !== null) {
                console.log("Current History Is Replay");
                // return;
            }
            const res = await api.get(`/history/state/${boardId}`);
            set({ loading: false, replayData: res.data });
        } catch(err: any){
            set({ error: err.message, loading: false });
        }
    },
    historyList: async (token: string) => {
        set({ loading: true, error: null });
        console.log("Fetch history list for token ", token);
        try{
            //get list
            const res = await api.get(`/history/${token}`);
            console.log("History List: " );
            set({ myHistory: res.data, loading: false });
        } catch(err: any){
            set({ error: err.message, loading: false });
            console.log("failed");
        }
    },
    insertHistory: async (historyPayload: HistoryPayload) => {
        set({ loading: true, error: null });
        //post history
        if(!historyPayload.token || historyPayload.token === ""){
            console.log("No token, cannot save history");
            return;
        }
        try{
            const res = await api.post("/history", historyPayload);
            console.log("Save: ", res.data);
            const current = useMyHistoryStore.getState().myHistory;
            set({ loading: false, myHistory: [...current, res.data.id] });

        } catch(err: any){
            set({ error: err.message, loading: false });
            console.log("failed");
        }
    }
}));