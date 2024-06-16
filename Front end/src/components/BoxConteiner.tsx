export default function BoxContainer({children, width, height}: {children: React.ReactNode, width: string, height: string}){
    return (
        <div className={`bg-grey-box/60 border-[1px] border-white/30 rounded-2xl shadow-lg p-4 ${width} ${height} `}>
            {children}
        </div>
    );
}