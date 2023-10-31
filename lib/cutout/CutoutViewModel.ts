import { extent, today } from "..";
import { flatMap } from "../itertools/map";
import flatten from "../itertools/flatten";
import type { Action } from "../Interactor";
import type { Data } from "../Observation";
import Observation, { type Series } from "../Observation";
import Stat from "../Stat";
import CutoutIndex from "./CutoutIndex";

class CutoutViewModel {
    public static from = (cutout: Iterable<CutoutIndex>): CutoutViewModel =>
        new CutoutViewModel(today(), [
            CutoutIndex.daily(cutout),
            CutoutIndex.index(cutout)
        ]);

    public static selectDate = (date = today()): Action<CutoutViewModel> =>
        model => new CutoutViewModel(date, model.#series);

    readonly #date: Date;
    readonly #series: Series[];

    private constructor(date: Date, series: Series[]) {
        this.#series = series;
        this.#date = date;
    }

    public get date(): Date {
        return this.#date;
    }

    public get cutout(): Series {
        return this.#series[0];
    }

    public get index(): Series {
        return this.#series[1];
    }

    public get dates(): readonly [Date, Date] {
        return Observation.extent(flatten<Observation>(this.#series));
    }

    public get values(): readonly [number, number] {
        return extent(flatMap(this.#series, (record: Data) => record.value));
    }

    public get stats(): Stat[] {
        return [{
            label: "Cutout",
            value: Stat.from(this.cutout, this.#date)
        }, {
            label: "Index",
            value: Stat.from(this.index, this.#date)
        }];
    }
}

export default CutoutViewModel;
