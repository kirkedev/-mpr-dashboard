import state, { type State, type MutableState } from "../async/state";
import { extentBy } from "../itertools/accumulate";
import { today } from "../time";
import Series, { type Data } from "../time/Series";
import Stat from "../Stat";
import Purchase from ".";

class PurchasesViewModel {
    public static from = (purchases: Iterable<Purchase>): PurchasesViewModel =>
        new PurchasesViewModel(Purchase.marketFormula(purchases));

    readonly #series: Series;
    public readonly selected: MutableState<Data>;
    public readonly stats: State<Stat>;

    private constructor(series: Series) {
        this.#series = series;
        this.selected = state(Series.find(series, today()));
        this.stats = this.selected.map(selected => Stat.from("Formula", selected.value));
    }

    public get series(): Series {
        return this.#series;
    }

    public get dates(): readonly [Date, Date] {
        return Series.extent(this.#series);
    }

    public get values(): readonly [number, number] {
        return extentBy(this.#series, record => record.value);
    }

    public selectDate = (date: Date): void => {
        this.selected.value = Series.find(this.series, date);
    };

    public resetDate = (): void => {
        this.selectDate(today());
    };
}

export default PurchasesViewModel;
