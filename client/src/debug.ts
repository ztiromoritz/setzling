type MemoryInfo = {
    jsHeapSizeLimit: number,
    totalJSHeapSize: number,
    usedJSHeapSize: number
}

export const debugHelper = {
    initPerformanceDebug() {
        const debugSection = document.querySelector('.performance-debug');

        setInterval(() => {
            if ((performance as any).memory && debugSection) {
                const memory: MemoryInfo = (performance as any).memory as MemoryInfo;
                const format = (sizeInByte: number) => ((sizeInByte / 1024).toFixed(2).toString().padStart(14, ' ') + ' kb')
                debugSection.innerHTML = `<pre>
jsHeapSizeLimit : ${format(memory.jsHeapSizeLimit)}
totalJSHeapSize : ${format(memory.totalJSHeapSize)}
usedJSHeapSize  : ${format(memory.usedJSHeapSize)}
            </pre>`;
                memory.jsHeapSizeLimit
            }
        }, 1000);

    },


    renderMessage: '',
    writeRenderDebug(msg: string) {
        this.renderMessage += msg + '\n';
    },

    finalizeRenderDebug() {
        const debugSection = document.querySelector('.render-debug');
        if (debugSection) {
            debugSection.innerHTML = `<pre> ${this.renderMessage} </pre>`;
            this.renderMessage = '';
        }
    }
}