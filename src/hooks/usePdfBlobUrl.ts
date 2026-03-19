/**
 * Hook to fetch a PDF from an authenticated backend endpoint and return a
 * temporary blob URL that can be used as an iframe src without CORS/auth issues.
 *
 * The blob URL is revoked automatically when the component unmounts or when
 * `apiUrl` changes.
 */
import { useState, useEffect } from "react";
import { getToken } from "@/lib/api/tokenStore";

interface PdfBlobState {
    blobUrl: string | null;
    isLoading: boolean;
    error: string | null;
}

export function usePdfBlobUrl(apiUrl: string | null): PdfBlobState {
    const [state, setState] = useState<PdfBlobState>(() => {
        return {
            blobUrl: null,
            isLoading: false,
            error: null,
        };
    });

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!apiUrl) {
            setState({ blobUrl: null, isLoading: false, error: null });
            return;
        }

        let revoked = false;
        let objectUrl: string | null = null;

        setState({ blobUrl: null, isLoading: true, error: null });

        (async () => {
            try {
                const token = getToken() ?? "";
                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/pdf, */*",
                    },
                });

                if (!response.ok) {
                    const body = await response.text();
                    let message = `HTTP ${response.status}`;
                    try {
                        message = JSON.parse(body)?.message ?? message;
                    } catch { /* empty */ }
                    if (!revoked) setState({ blobUrl: null, isLoading: false, error: message });
                    return;
                }

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                if (!revoked) setState({ blobUrl: objectUrl, isLoading: false, error: null });
            } catch (err) {
                if (!revoked)
                    setState({
                        blobUrl: null,
                        isLoading: false,
                        error: err instanceof Error ? err.message : "Network error",
                    });
            }
        })();

        return () => {
            revoked = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [apiUrl]);

    return state;
}
