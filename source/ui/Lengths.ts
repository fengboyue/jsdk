/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.0.0
 * @author Frank.Feng
 */
module JS {

    export namespace ui {

        export enum LengthUnit {
            PCT = '%',
            PX = 'px',
            IN = 'in',
            CM = 'cm',
            MM = 'mm',
            EM = 'em',
            EX = 'ex',
            PT = 'pt',
            PC = 'pc',
            REM = 'rem'
        }

        /**
         * Length Helper. 
         */
        export class Lengths {

            public static toPxNumber(len: string | number): number {
                if (len == void 0) return 0;
                if (Types.isNumeric(len)) return <number>len;

                let le = String(len);
                if (le.endsWith('%')) return 0;
                return parseFloat(le.replace(/^.+[px]$/, ''));
            }

            public static toCssString(len: string | number, defaultVal:string, unit?: LengthUnit): string {
                if (len == void 0) return defaultVal||'auto';
                if (Types.isNumeric(len)) return Number(len) + '' + (unit || LengthUnit.PX);

                return String(len);
            }
        }

    }
}
import Lengths = JS.ui.Lengths;

