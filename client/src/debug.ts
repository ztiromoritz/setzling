type MemoryInfo = {
    jsHeapSizeLimit: number,
    totalJSHeapSize: number,
    usedJSHeapSize: number
}

export const debug = ()=>{

    const debugSection = document.querySelector('.debug');

    setInterval(()=>{
        if((performance as any).memory && debugSection){
            const memory: MemoryInfo = (performance as any).memory as MemoryInfo;
            debugSection.innerHTML = `<pre>
                jsHeapSizeLimit : ${memory.jsHeapSizeLimit}
                totalJSHeapSize : ${memory.totalJSHeapSize}
                usedJSHeapSize  : ${memory.usedJSHeapSize}
            </pre>`;
            memory.jsHeapSizeLimit
        }}, 1000);

}