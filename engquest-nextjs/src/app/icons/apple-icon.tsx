// Apple touch icon renderer used by iOS home screen installation.

import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
    width: 180,
    height: 180,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 120, // Larger font size for 180x180
                    background: "linear-gradient(to bottom right, #4f46e5, #06b6d4)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    borderRadius: "32px", // Consistent rounded corners for Apple icon
                    fontWeight: 700,
                }}
            >
                L
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
