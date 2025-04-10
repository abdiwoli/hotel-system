// src/app/layout.tsx

import React from "react";

// You can add any global providers or styles here

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Hotel Management</title>
                {/* You can include other meta tags or links to stylesheets here */}
            </head>
            <body>
                {/* Global providers, navigation, or other components can be included here */}
                {children}
            </body>
        </html>
    );
};

export default RootLayout;
