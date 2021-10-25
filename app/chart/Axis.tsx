import type { JSXElement } from "solid-js";
import { onMount } from "solid-js";
import { select } from "d3-selection";
import type { Axis, AxisDomain, AxisScale } from "d3-axis";
import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis";
import type { Offset } from ".";
import styles from "./Chart.module.css";

interface ChartAxisProps<Domain extends AxisDomain> extends Partial<Offset>{
    axis: Axis<Domain>;
}

interface AxisProps<Domain extends AxisDomain> extends Partial<Offset> {
    tickSize?: number;
    tickCount?: number;
    tickPadding?: number;
    scale: AxisScale<Domain>
}

const mapProps = <Domain extends AxisDomain>(
    axis: (scale: AxisScale<Domain>) => Axis<Domain>,
    props: AxisProps<Domain>
): ChartAxisProps<Domain> => ({
    left: props.left,
    top: props.top,
    axis: axis(props.scale)
        .ticks(props.tickCount)
        .tickSize(props.tickSize ?? 0)
        .tickPadding(props.tickPadding ?? 8)
});

function ChartAxis<Domain extends AxisDomain>({ axis, left = 0, top = 0 }: ChartAxisProps<Domain>): JSXElement {
    let group: SVGGElement;
    onMount(() => select(group).call(axis));
    return <g class={styles.axis} ref={el => group = el} transform={`translate(${left},${top})`}/>;
}

const LeftAxis = <Domain extends AxisDomain>(props: AxisProps<Domain>) =>
    <ChartAxis { ...mapProps(axisLeft, props) }/>;

const BottomAxis = <Domain extends AxisDomain>(props: AxisProps<Domain>) =>
    <ChartAxis { ...mapProps(axisBottom, props) }/>;

const TopAxis = <Domain extends AxisDomain>(props: AxisProps<Domain>) =>
    <ChartAxis { ...mapProps(axisTop, props) }/>;

const RightAxis = <Domain extends AxisDomain>(props: AxisProps<Domain>) =>
    <ChartAxis { ...mapProps(axisRight, props) }/>;

export { LeftAxis, BottomAxis, RightAxis, TopAxis };
