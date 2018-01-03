export {simpleHeatmap as heatmap, simpleArcmap as arcmap} from "./heatmap";
export {treeQuantization as quantization, squareQuantization, linearQuantization} from "./quantization";
export {simpleScale as scale} from "./scale";
export {continuousSquare as csquare, continuousArc as carc, continuousLine as cline} from "./continuous";
import * as legend_ from "./legend";
export const legend = legend_;
