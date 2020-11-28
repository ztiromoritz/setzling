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
            const format = (sizeInByte:number) =>( (sizeInByte/1024).toFixed(2).toString().padStart(14,' ') + ' kb' )
            debugSection.innerHTML = `<pre>
jsHeapSizeLimit : ${format(memory.jsHeapSizeLimit) }
totalJSHeapSize : ${format(memory.totalJSHeapSize)}
usedJSHeapSize  : ${format(memory.usedJSHeapSize)}
            </pre>`;
            memory.jsHeapSizeLimit
        }}, 1000);

}