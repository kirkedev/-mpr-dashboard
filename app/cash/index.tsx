import type { JSXElement } from "solid-js";
import { createResource, Match, Switch } from "solid-js";
import type { CashIndex } from "lib/CashIndex";
import cashIndex from "lib/CashIndex";
import Report from "./Report";
import slaughter from "../api/slaughter";

function Cash(): JSXElement {
    const [data] = createResource(() =>
        slaughter.query(new Date(2021, 7, 2), new Date(2021, 9, 3))
            .then(cashIndex)
            .then(Array.from));

    return <Switch fallback={<Report cash={data() as CashIndex[]}/>}>
        <Match when={data.loading}>
            <div>Loading...</div>
        </Match>

        <Match when={data.error}>
            <div>Error</div>
        </Match>
    </Switch>;
}

export default Cash;
