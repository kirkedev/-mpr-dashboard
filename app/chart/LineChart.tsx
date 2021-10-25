import type { JSXElement } from "solid-js";
import { Index } from "solid-js";
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import { flatMap } from "lib/itertools/map";
import type { Dimensions, Offset, Series } from ".";
import { BottomAxis, RightAxis } from "./Axis";
import Plot from "./Plot";
import Path from "./Path";
import "./Chart.module.css";

interface Props extends Dimensions, Partial<Offset> {
    data: Series[];
}

const extendBy = ([min = 0, max = 0]: [number?, number?], multiple: number): [number, number] =>
    [Math.floor(min / multiple) * multiple, Math.ceil(max / multiple) * multiple];

function LineChart({ data, width, height, left = 0, bottom = 0, right = 0, top = 0 }: Props): JSXElement {
    const dates = scaleTime()
        .range([left, width - right])
        .domain(extent(flatMap(data, record => record.date)) as [Date, Date]);

    const values = scaleLinear()
        .range([height - bottom, top])
        .domain(extendBy(extent(flatMap(data, record => record.value)), 5));

    return <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <RightAxis left={width - right} scale={values} tickCount={5} tickSize={left - width + right}/>
        <BottomAxis top={height - bottom} scale={dates} tickCount={8} tickPadding={24}/>
        <Plot>
            <Index each={data}>
                { series => <Path data={series()} x={dates} y={values}/> }
            </Index>
        </Plot>
    </svg>;
}

export default LineChart;