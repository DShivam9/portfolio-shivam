"use client";

import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ── INTEGRATED BRAND ICONS ──

const ThreejsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M12 2L2 22h20L12 2zm0 4.5L18.5 18H5.5L12 6.5z" />
  </svg>
);

const WebglIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const GlslIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M12 22V12" />
    <path d="M2 17l10 5 10-5" />
    <path d="M17 14.5L12 12 7 14.5" />
  </svg>
);

const GsapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const FramerIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M12 24v-8h8l-8 8zm0-8v-8h8V0H4v16h8z" />
  </svg>
);

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
  </svg>
);

const JavaScriptIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
  </svg>
);

const TypeScriptIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M1.5 0h21a1.5 1.5 0 0 1 2.5 1.5v21a1.5 1.5 0 0 1-1.5 1.5h-21a1.5 1.5 0 0 1-1.5-1.5v-21a1.5 1.5 0 0 1 1.5-1.5zm11.39 12.872h-2.1v6.331h-2.1v-6.331h-2.1v-1.872h6.3v1.872zm6.208 2.051c0 1.25-.452 2.155-1.356 2.716-.905.56-2.146.84-3.722.84-.712 0-1.378-.06-1.996-.182a5.4 5.4 0 0 1-1.637-.53v-1.921c.54.331 1.096.586 1.666.764.57.179 1.109.268 1.616.268.796 0 1.393-.162 1.792-.487.4-.325.599-.8.599-1.427 0-.427-.1-.784-.301-1.071-.2-.288-.493-.538-.877-.751-.383-.213-.853-.418-1.407-.615-.817-.291-1.488-.636-2.012-1.036-.525-.4-.917-.899-1.177-1.498-.26-.599-.39-1.32-.39-2.164 0-1.18.423-2.072 1.268-2.678.846-.606 2.008-.91 3.488-.91.684 0 1.309.056 1.878.17.57.112 1.062.274 1.477.487l-.927 1.78a5.22 5.22 0 0 0-1.332-.445c-.458-.095-.916-.143-1.376-.143-.728 0-1.282.14-1.662.421-.38.28-.57.697-.57 1.25 0 .37.087.692.26.963.174.272.433.51.777.714.344.204.795.399 1.353.585.842.28 1.542.613 2.1 1 .557.387.973.876 1.248 1.467.276.592.414 1.29.414 2.094z" />
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
  </svg>
);

const NextjsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M18.665 21.978l-9.452-12.022v12.022H6.665V2.022h2.548l9.452 12.022V2.022h2.548v19.956z M16.149 2.022h2.548v7.625l-2.548-3.245z" />
  </svg>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
  </svg>
);

const Html5Icon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" />
  </svg>
);

const Css3Icon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
  </svg>
);

const ViteIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z" />
  </svg>
);

const VercelIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="m12 1.608 12 20.784H0Z" />
  </svg>
);

const NodejsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M22.06 6.34L12.06 1.74a.75.75 0 0 0-.64 0l-10 4.6a.75.75 0 0 0-.42.67v8.78a.75.75 0 0 0 .42.67l10 4.6a.75.75 0 0 0 .64 0l10-4.6a.75.75 0 0 0 .42-.67V7.01a.75.75 0 0 0-.42-.67zM12 21.05l-8.5-3.92V7.74l3.75 1.72v7.71l4.75 2.18V9.75l3.75-1.72v9.39zm0-10.38l-4.75-2.18 4.75-2.18 4.75 2.18zm8.5-2.93l-3.75 1.72v7.71l4.75-2.18V7.74z" />
  </svg>
);

const ExpressIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z" />
  </svg>
);

const PostgresqlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const MysqlIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 00.3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 00-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 00-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 00-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 00-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 01-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 01-.35-.4 8.76 8.76 0 01-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 01-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 012.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z" />
  </svg>
);

const FirebaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M19.455 8.369c-.538-.748-1.778-2.285-3.681-4.569-.826-.991-1.535-1.832-1.884-2.245a146 146 0 0 0-.488-.576l-.207-.245-.113-.133-.022-.032-.01-.005L12.57 0l-.609.488c-1.555 1.246-2.828 2.851-3.681 4.64-.523 1.064-.864 2.105-1.043 3.176-.047.241-.088.489-.121.738-.209-.017-.421-.028-.632-.033-.018-.001-.035-.002-.059-.003a7.46 7.46 0 0 0-2.28.274l-.317.089-.163.286c-.765 1.342-1.198 2.869-1.252 4.416-.07 2.01.477 3.954 1.583 5.625 1.082 1.633 2.61 2.882 4.42 3.611l.236.095.071.025.003-.001a9.59 9.59 0 0 0 2.941.568q.171.006.342.006c1.273 0 2.513-.249 3.69-.742l.008.004.313-.145a9.63 9.63 0 0 0 3.927-3.335c1.01-1.49 1.577-3.234 1.641-5.042.075-2.161-.643-4.304-2.133-6.371m-7.083 6.695c.328 1.244.264 2.44-.191 3.558-1.135-1.12-1.967-2.352-2.475-3.665-.543-1.404-.87-2.74-.974-3.975.48.157.922.366 1.315.622 1.132.737 1.914 1.902 2.325 3.461zm.207 6.022c.482.368.99.712 1.513 1.028-.771.21-1.565.302-2.369.273a8 8 0 0 1-.373-.022c.458-.394.869-.823 1.228-1.279zm1.347-6.431c-.516-1.957-1.527-3.437-3.002-4.398-.647-.421-1.385-.741-2.194-.95.011-.134.026-.268.043-.4.014-.113.03-.216.046-.313.133-.689.332-1.37.589-2.025.099-.25.206-.499.321-.74l.004-.008c.177-.358.376-.719.61-1.105l.092-.152-.003-.001c.544-.851 1.197-1.627 1.942-2.311l.288.341c.672.796 1.304 1.548 1.878 2.237 1.291 1.549 2.966 3.583 3.612 4.48 1.277 1.771 1.893 3.579 1.83 5.375-.049 1.395-.461 2.755-1.195 3.933-.694 1.116-1.661 2.05-2.8 2.708-.636-.318-1.559-.839-2.539-1.599.79-1.575.952-3.28.479-5.072zm-2.575 5.397c-.725.939-1.587 1.55-2.09 1.856-.081-.029-.163-.06-.243-.093l-.065-.026c-1.49-.616-2.747-1.656-3.635-3.01-.907-1.384-1.356-2.993-1.298-4.653.041-1.19.338-2.327.882-3.379.316-.07.638-.114.96-.131l.084-.002c.162-.003.324-.003.478 0 .227.011.454.035.677.07.073 1.513.445 3.145 1.105 4.852.637 1.644 1.694 3.162 3.144 4.515z" />
  </svg>
);

const ClaudeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3418 1.445 2.4832.747 1.2573.34.6255c.0607.255.1092.4614.1092.7224l-.006.589-.419.3642-.9958-.1335-.4189-.3643-.7286-1.5724L15.347 12.01l-1.6393-3.151-.437-.8318-.243-.8319-.091-.255h-.164v.1518l-.1275 1.7001-.2368 2.0947-.2307 2.6957-.0789.7588-.3764.9108-.7408.4857-.5888-.2733-.4797-.686.0668-.4493.2853-1.8517.5587-2.896.3643-1.9429h-.2125l-.2429.2368-.9835 1.3113-1.6514 2.0583-.7286.8196-.85.9107-.5464.425H6.973l-.759-1.1232.34-1.1658 1.0625-1.3418-1.445-2.4831-.747-1.2574-.34-.6255c-.0607-.255-.1092-.4614-.1092-.7224l.0061-.5952.419-.3581.9957.1335.419.3643.7286 1.5724 1.1897 2.2282 1.6393 3.151.437.8318.243.8319.091.255h.158v-.1519l.1336-1.7001.2367-2.0947.2308-2.6957.0789-.7588.3763-.9108.7409-.4857.5888.2733.4797.686-.0668.4493-.2853 1.8517-.5587 2.896-.3643 1.9429h-.2186l.2368-.2368.9835-1.3113 1.6514-2.0583.7286-.8196.85-.9107.5464-.425H18.9868l.759 1.1232-.34 1.1658-1.0625 1.3418 1.445 2.4831.747 1.2574.34.6255c.0607.255.1092.4614.1092.7224l-.0061.5952-.419.3581-.9957-.1335-.419-.3643-.7286-1.5724-1.1897-2.2282-1.6393-3.151-.437-.8318-.243-.8319-.091-.255h-.158v-.1519l-.1336 1.7001-.2367 2.0947-.2308 2.6957-.0789-.7588-.3763-.9108-.7409-.4857.5888.2733.4797.686-.0668.4493-.2853 1.8517-.5587 2.896-.3643 1.9429h-.2186l-.2368.2368-.9835-1.3113 1.6514-2.0583.7286-.8196.85-.9107.5464-.425H11.0028l-.759-1.1232.34-1.1658 1.0625-1.3418-1.445-2.4831-.747-1.2574-.34-.6255c-.0607-.255-.1092-.4614-.1092-.7224l.0061-.5952.419-.3581.9957.1335.419.3643.7286 1.5724L12.339 9.8356l1.6393 3.151.437.8318.243.8319.091.255h.158v.255H9.6806l-.0789.2307-.8865.2307-2.6592.1275-2.2707.0971-1.621.0729-.686.0425-.5464.3824-.0425.2974.2246.3339.4675-.0607 2.2586-.1032 2.6957-.0729 1.6393-.0425 2.1245-.0243.346-.1093.079.2368-.079.0971-.1093.0972-2.1852.8803-2.6592.9836-2.295.7711-2.2706.674-.68.17-.4614.4979.0607.3157.4371.1822.6192-.0972 2.1852-.6315 2.6592-.8136 1.6393-.437 2.1366-.5404H10.1l.0789.2307-.8865.2307-2.6592.1275-2.2707.0971-1.621.0729-.686.0425-.5464.3824-.0425.2974.2246.3339.4675-.0607 2.2586-.1032 2.6957-.0729 1.6393-.0425 2.1245-.0243.346-.1093.079.2368-.079.0971-.1093.0972-2.1852.8803-2.6592.9836-2.295.7711-2.2706.674-.68.17-.4614.4979.0607.3157.4371.1822.6192-.0972 2.1852-.6315 2.6592-.8136 1.6393-.437 2.1366-.5404z" />
  </svg>
);

const GoogleAntigravityIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M2 20 C2 12, 6 4, 12 4 C18 4, 22 12, 22 20 C22 21, 21 21, 20 20 C18 18, 16 16, 12 16 C8 16, 6 18, 4 20 C3 21, 2 21, 2 20 Z" />
  </svg>
);

const StitchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 1.05 15.34 0 12.24 0 5.518 0 0 5.373 0 12s5.518 12 12.24 12c7.054 0 11.758-4.97 11.758-11.966 0-.81-.087-1.425-.195-1.749H12.24z" />
  </svg>
);

const ManusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M14 18h-4a5 5 0 0 1-5-5v-1a2 2 0 0 1 2-2h1" />
    <path d="M12 7c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" />
    <path d="M8 12a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2" />
    <line x1="12" y1="3" x2="12" y2="5" />
    <line x1="16" y1="5" x2="15" y2="6.5" />
    <line x1="8" y1="5" x2="9" y2="6.5" />
  </svg>
);

const GitIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M13.09 23.549a1.54 1.54 0 0 1-2.18 0L.451 13.089a1.54 1.54 0 0 1 0-2.179l7.191-7.19 2.733 2.733a1.85 1.85 0 0 0 .964 2.326v6.66a1.849 1.849 0 1 0 1.54 0V8.957l2.508 2.508a1.85 1.85 0 1 0 1.09-1.09l-2.634-2.634a1.85 1.85 0 0 0-2.378-2.377L8.73 2.63 10.91.451a1.54 1.54 0 0 1 2.179 0l10.459 10.46a1.54 1.54 0 0 1 0 2.179z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
    <path d="M13.962 8.224h-2.43V5.79h2.43v2.434zm0 2.99h-2.43v2.43h2.43V11.21zm-3.237-2.99h-2.43V5.79h2.43v2.434zm0 2.99h-2.43v2.43h2.43V11.21zm-3.237 0h-2.43v2.43h2.43v-2.43zm0-2.99h-2.43V5.79h2.43v2.434zm-3.238 2.99h-2.43v2.43h2.43v-2.43zm0-2.99h-2.43V5.79h2.43v2.434zm12.912 2.99h-2.43v2.43h2.43V11.21zm0-2.99h-2.43V5.79h2.43v2.434zm3.237 2.99h-2.43v2.43h2.43V11.21zm1.656-1.72c-.156-.59-.75-1.12-1.34-1.18-.09-.01-.18-.01-.27 0-.09-.59-.57-1.18-1.28-1.18-.75 0-1.37.62-1.37 1.37v.75h-1.63v2.44c0 .87-.69 1.56-1.56 1.56H1.19c-.31 0-.63-.12-.87-.37-.25-.24-.31-.56-.31-.87V23c0 .56.44 1 1 1h21c.56 0 1-.44 1-1V9.49z" />
  </svg>
);


interface TechItem {
  id: string;
  name: string;
  desc: string;
  IconComponent: React.ComponentType;
}

// ── 4 CATEGORY ARRAYS FOR INTERACTIVE DIRECTORY ──

const CREATIVE_TECH: TechItem[] = [
  { id: "threejs", name: "Three.js", desc: "Interactive 3D scene graphs and WebGL graphics maps.", IconComponent: ThreejsIcon },
  { id: "webgl", name: "WebGL", desc: "GPU pipeline access and low-level custom render buffers.", IconComponent: WebglIcon },
  { id: "glsl", name: "GLSL Shaders", desc: "Custom fragment shaders, procedural noise, and raymarching.", IconComponent: GlslIcon },
  { id: "gsap", name: "GSAP", desc: "High-frequency cinematic scroll and timeline tweening physics.", IconComponent: GsapIcon },
  { id: "framer", name: "Framer Motion", desc: "Declarative spring physics and custom route transitions.", IconComponent: FramerIcon },
  { id: "figma", name: "Figma", desc: "Collaborative mockups, layout coordinates, and responsive vector grids.", IconComponent: FigmaIcon }
];

const CORE_ENGINEERING: TechItem[] = [
  { id: "javascript", name: "JavaScript", desc: "Dynamic script loops, DOM integrations, and Web API hooks.", IconComponent: JavaScriptIcon },
  { id: "typescript", name: "TypeScript", desc: "Compile-time strict type safety and generic schemas.", IconComponent: TypeScriptIcon },
  { id: "react", name: "React.js", desc: "Declarative component trees, virtual DOM diffing, and state render loops.", IconComponent: ReactIcon },
  { id: "nextjs", name: "Next.js", desc: "Production App Router structures, SSR, and SSG rendering pipelines.", IconComponent: NextjsIcon },
  { id: "tailwind", name: "Tailwind CSS", desc: "Utility-first design token configurations and responsive theme states.", IconComponent: TailwindIcon },
  { id: "html5", name: "HTML5", desc: "Semantic structural layers, browser layout guidelines, and SEO accessibility nodes.", IconComponent: Html5Icon },
  { id: "css3", name: "CSS3", desc: "Cascading style trees, responsive designs, custom tokens, and layout physics rules.", IconComponent: Css3Icon },
  { id: "vite", name: "Vite", desc: "Fast dev server bundling, hot modules replacement, and production assets.", IconComponent: ViteIcon },
  { id: "vercel", name: "Vercel", desc: "Global edge network caching and instant serverless CDN deployments.", IconComponent: VercelIcon }
];

const SYSTEMS_DEVOPS: TechItem[] = [
  { id: "nodejs", name: "Node.js", desc: "Scalable event-driven event loop and server-side code runtimes.", IconComponent: NodejsIcon },
  { id: "express", name: "Express.js", desc: "RESTful HTTP server routers, custom request middlewares, and API payload handlers.", IconComponent: ExpressIcon },
  { id: "postgresql", name: "PostgreSQL", desc: "Relational database queries, indexing, and connection pools.", IconComponent: PostgresqlIcon },
  { id: "mysql", name: "MySQL", desc: "Structured data storage, database indexing, and schema transactions.", IconComponent: MysqlIcon },
  { id: "firebase", name: "Firebase (Firestore)", desc: "Cloud document databases, user auth flows, and real-time listeners.", IconComponent: FirebaseIcon },
  { id: "git", name: "Git", desc: "Local source control history, commit registers, and branch hooks.", IconComponent: GitIcon },
  { id: "github", name: "GitHub", desc: "Remote code synchronization, pull reviews, and automated actions.", IconComponent: GithubIcon },
  { id: "docker", name: "Docker", desc: "Isolated virtualization containers and microservice environments.", IconComponent: DockerIcon }
];

const INTELLIGENT_AGENTS: TechItem[] = [
  { id: "claude", name: "Claude", desc: "Autonomous local shell logic and context-guided code refactoring.", IconComponent: ClaudeIcon },
  { id: "antigravity", name: "Google Antigravity", desc: "Advanced pair-programming interactions and automated workspace safety.", IconComponent: GoogleAntigravityIcon },
  { id: "stitch", name: "Stitch", desc: "Cross-platform style synchronization and token compilation.", IconComponent: StitchIcon },
  { id: "manus", name: "Manus", desc: "Sequential workflow automation and system loop orchestration.", IconComponent: ManusIcon }
];

const toRoman = (num: number): string => {
  const romanMap = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  return romanMap[num] || (num + 1).toString();
};

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();



  // ── GSAP Scroll reveals for editorial layout elements ──
  useGSAP(() => {
    if (!containerRef.current) return;

    // Left sticky column fade-up
    if (leftColRef.current) {
      gsap.fromTo(leftColRef.current,
        { filter: "blur(5px)", opacity: 0, y: 30 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftColRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          clearProps: "filter"
        }
      );
    }

    // Right ledger rows staggered reveal
    const rows = containerRef.current.querySelectorAll(".ledger-row");
    rows.forEach((row, idx) => {
      gsap.fromTo(row,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: idx * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, { scope: containerRef });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || isReduced) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (window.innerWidth >= 1024) {
      gsap.to(containerRef.current, {
        "--mouse-x": `${x}px`,
        "--mouse-y": `${y}px`,
        duration: 0.7,
        ease: "power2.out"
      });
    }
  };

  const handlePointerLeave = () => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      "--mouse-x": "50%",
      "--mouse-y": "-20%",
      duration: 1,
      ease: "power2.out"
    });
  };

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full py-28 md:py-44 bg-[#030304] z-10 overflow-hidden flex flex-col items-center select-none"
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "-20%"
      } as React.CSSProperties}
    >
      <style>{`
        .ledger-serif {
          font-family: var(--font-serif), "Melodrama", Georgia, serif !important;
        }
        .ledger-sans {
          font-family: var(--font-sans), "Outfit", sans-serif !important;
        }
      `}</style>

      {/* ── SPLIT EDITORIAL DIRECTORY LAYOUT ── */}
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 max-w-7xl w-full mx-auto z-10 px-6 md:px-12">
        
        {/* LEFT COLUMN: Pinned Typographic description */}
        <div 
          ref={leftColRef}
          className="w-full lg:w-[40%] flex flex-col justify-start lg:sticky lg:top-32 h-fit"
          style={{ willChange: "transform, opacity, filter", opacity: 0 }}
        >
          <h2 className="ledger-serif text-5xl md:text-7xl text-text-primary tracking-tight leading-none">
            Architectural<br />
            <span className="italic bg-gradient-to-r from-accent via-[#ffdf99] to-accent bg-clip-text text-transparent">
              Stack
            </span>
          </h2>
          
          <p className="ledger-serif italic text-sm md:text-[16px] leading-relaxed text-text-secondary/50 max-w-[32ch] mt-6">
            A curated directory of frameworks, languages, and intelligent systems deployed in my digital practice. Structured for speed, scale, and responsive motion.
          </p>
        </div>

        {/* RIGHT COLUMN: Asymmetrical Editorial Ledger */}
        <div className="w-full lg:w-[60%] flex flex-col border-b border-white/10">
          
          {/* Row 1: Creative Tech */}
          <div className="ledger-row border-t border-white/10 py-7 md:py-9 flex flex-col gap-6" style={{ willChange: 'transform, opacity' }}>
            <div className="flex items-baseline justify-between w-full">
              <h3 className="ledger-serif italic text-xl md:text-2xl text-white/85">
                01 / Creative Tech
              </h3>
              <span className="ledger-sans text-[9px] font-mono tracking-widest uppercase text-accent/40">
                Interactive Experiences
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {CREATIVE_TECH.map((tech, index) => (
                <LedgerItem
                  key={tech.id}
                  tech={tech}
                  roman={toRoman(index)}
                />
              ))}
            </div>
          </div>

          {/* Row 2: Core Engineering */}
          <div className="ledger-row border-t border-white/10 py-7 md:py-9 flex flex-col gap-6" style={{ willChange: 'transform, opacity' }}>
            <div className="flex items-baseline justify-between w-full">
              <h3 className="ledger-serif italic text-xl md:text-2xl text-white/85">
                02 / Core Engineering
              </h3>
              <span className="ledger-sans text-[9px] font-mono tracking-widest uppercase text-accent/40">
                Performance Foundations
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {CORE_ENGINEERING.map((tech, index) => (
                <LedgerItem
                  key={tech.id}
                  tech={tech}
                  roman={toRoman(index)}
                />
              ))}
            </div>
          </div>

          {/* Row 3: Systems & DevOps */}
          <div className="ledger-row border-t border-white/10 py-7 md:py-9 flex flex-col gap-6" style={{ willChange: 'transform, opacity' }}>
            <div className="flex items-baseline justify-between w-full">
              <h3 className="ledger-serif italic text-xl md:text-2xl text-white/85">
                03 / Systems & Cloud
              </h3>
              <span className="ledger-sans text-[9px] font-mono tracking-widest uppercase text-accent/40">
                Data Infrastructure
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {SYSTEMS_DEVOPS.map((tech, index) => (
                <LedgerItem
                  key={tech.id}
                  tech={tech}
                  roman={toRoman(index)}
                />
              ))}
            </div>
          </div>

          {/* Row 4: Intelligent Agents */}
          <div className="ledger-row border-t border-white/10 py-7 md:py-9 flex flex-col gap-6" style={{ willChange: 'transform, opacity' }}>
            <div className="flex items-baseline justify-between w-full">
              <h3 className="ledger-serif italic text-xl md:text-2xl text-white/85">
                04 / Cognitive Agents
              </h3>
              <span className="ledger-sans text-[9px] font-mono tracking-widest uppercase text-accent/40">
                Agentic Orchestration
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {INTELLIGENT_AGENTS.map((tech, index) => (
                <LedgerItem
                  key={tech.id}
                  tech={tech}
                  roman={toRoman(index)}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

      <div className="h-12 md:h-24 pointer-events-none" />
    </section>
  );
}

// ── STATIC DIRECTORY ITEM NODE WITH PRINT METADATA STYLE ──

interface LedgerItemProps {
  tech: TechItem;
  roman: string;
}

function LedgerItem({ tech, roman }: LedgerItemProps) {
  return (
    <div className="relative py-2.5 px-3 flex items-center justify-between select-none border-l border-white/5">
      <div className="flex items-baseline gap-2 overflow-hidden mr-2">
        <span className="ledger-serif italic text-[10.5px] text-white/20 shrink-0">
          {roman}.
        </span>
        <h4 className="ledger-sans text-[12.5px] font-bold uppercase tracking-[0.16em] leading-none truncate text-white/60">
          {tech.name}
        </h4>
      </div>
      
      <div className="shrink-0 scale-[0.68] md:scale-[0.75] origin-right text-white/15">
        <tech.IconComponent />
      </div>
    </div>
  );
}
