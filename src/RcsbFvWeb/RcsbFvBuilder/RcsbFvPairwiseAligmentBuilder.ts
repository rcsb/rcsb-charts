import {RcsbFvAdditionalConfig, RcsbFvModulePublicInterface} from "../RcsbFvModule/RcsbFvModuleInterface";
import {RcsbFvCoreBuilder} from "./RcsbFvCoreBuilder";
import {RcsbFvPairwiseAlignment} from "../RcsbFvModule/RcsbFvPairwiseAlignment";
import {PairwiseAlignmentInterface} from "../../RcsbUtils/PairwiseAlignmentTools/PairwiseAlignmentBuilder";

export class RcsbFvPairwiseAligmentBuilder {
     static async buildPairwiseAlignment(elementId:string, psa: PairwiseAlignmentInterface, additionalConfig?:RcsbFvAdditionalConfig): Promise<RcsbFvModulePublicInterface> {
         return new Promise<RcsbFvModulePublicInterface>((resolve, reject)=>{
             try {
                 RcsbFvCoreBuilder.createFv({
                     elementId: elementId,
                     fvModuleI: RcsbFvPairwiseAlignment,
                     config: {
                         psa: psa,
                         additionalConfig:{
                             rcsbContext:{
                                 queryId:psa.queryId,
                                 targetId:psa.targetId
                             },
                             ...additionalConfig
                         },
                         resolve:resolve
                     }
                 });
             }catch(e) {
                 reject(e);
             }
         });
    }
}