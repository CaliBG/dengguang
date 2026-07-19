export type HtmlCanvas = HTMLCanvasElement & {
  requestPaint?: () => void;
};

type HtmlCanvasWindow = Window & {
  __HTML_IN_CANVAS_POLYFILL__?: boolean;
};

type ElementTexturePrototype = {
  texElementImage2D?: (
    target: number,
    level: number,
    internalFormat: number,
    format: number,
    type: number,
    source: HTMLElement,
  ) => void;
};

/**
 * Bridges three-html-render 0.1.x to the short texElementImage2D overload used
 * by current Three.js releases. Native implementations remain untouched.
 */
export function installThreeHtmlTextureCompatibility() {
  if (!(window as HtmlCanvasWindow).__HTML_IN_CANVAS_POLYFILL__) return;

  const contextConstructors = [globalThis.WebGLRenderingContext, globalThis.WebGL2RenderingContext];
  for (const contextConstructor of contextConstructors) {
    if (!contextConstructor) continue;
    const prototype = contextConstructor.prototype as ElementTexturePrototype;
    const uploadElement = prototype.texElementImage2D;
    if (!uploadElement || uploadElement.length !== 3) continue;

    Object.defineProperty(prototype, "texElementImage2D", {
      configurable: true,
      writable: true,
      value: function texElementImage2D(
        this: WebGLRenderingContext | WebGL2RenderingContext,
        target: number,
        level: number,
        internalFormat: number,
        format: number,
        type: number,
        source: HTMLElement,
      ) {
        uploadElement.call(this, target, level, internalFormat, format, type, source);
      },
    });
  }
}
