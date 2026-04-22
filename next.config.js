{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red193\green193\blue193;\red24\green24\blue24;\red89\green138\blue67;
\red70\green137\blue204;\red67\green192\blue160;\red202\green202\blue202;\red66\green179\blue255;\red140\green211\blue254;
\red194\green126\blue101;}
{\*\expandedcolortbl;;\cssrgb\c80000\c80000\c80000;\cssrgb\c12157\c12157\c12157;\cssrgb\c41569\c60000\c33333;
\cssrgb\c33725\c61176\c83922;\cssrgb\c30588\c78824\c69020;\cssrgb\c83137\c83137\c83137;\cssrgb\c30980\c75686\c100000;\cssrgb\c61176\c86275\c99608;
\cssrgb\c80784\c56863\c47059;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 ```js\cb1 \
\cf4 \cb3 \strokec4 /** \cf5 \strokec5 @type\cf4 \strokec4  \cf6 \strokec6 \{import('next').NextConfig\}\cf4 \strokec4  */\cf2 \cb1 \strokec2 \
\cf5 \cb3 \strokec5 const\cf7 \strokec7  \cf8 \strokec8 nextConfig\cf7 \strokec7  = \{\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7   \cf9 \strokec9 output:\cf7 \strokec7  \cf10 \strokec10 "export"\cf7 \strokec7 ,          \cf4 \strokec4 // Emit static files to /out\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7   \cf9 \strokec9 trailingSlash:\cf7 \strokec7  \cf5 \strokec5 true\cf7 \strokec7 ,       \cf4 \strokec4 // Required for GitHub Pages routing\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7   \cf9 \strokec9 images:\cf7 \strokec7  \{\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7     \cf9 \strokec9 unoptimized:\cf7 \strokec7  \cf5 \strokec5 true\cf7 \strokec7 ,        \cf4 \strokec4 // next/image optimization needs a server; disable for static\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7   \},\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7   \cf4 \strokec4 // Only needed if deploying to a sub-path (e.g. github.io/repo-name/)\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7   \cf4 \strokec4 // basePath: "/konncafe",\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7   \cf4 \strokec4 // assetPrefix: "/konncafe/",\cf2 \cb1 \strokec2 \
\cf7 \cb3 \strokec7 \};\cf2 \cb1 \strokec2 \
\
\cf6 \cb3 \strokec6 module\cf7 \strokec7 .\cf6 \strokec6 exports\cf7 \strokec7  = \cf9 \strokec9 nextConfig\cf7 \strokec7 ;\cf2 \cb1 \strokec2 \
\cb3 ```\cb1 \
}