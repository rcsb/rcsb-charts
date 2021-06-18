import {RcsbFvAdditionalConfig} from "../RcsbFvModule/RcsbFvModuleInterface";
import {PolymerEntityInstanceTranslate} from "../Utils/PolymerEntityInstanceTranslate";
import {RcsbFvInstance} from "../RcsbFvModule/RcsbFvInstance";
import {TagDelimiter} from "../Utils/TagDelimiter";
import {EntryInstancesCollector, PolymerEntityInstanceInterface} from "../CollectTools/EntryInstancesCollector";
import {RcsbFvCoreBuilder} from "./RcsbFvCoreBuilder";
import {rcsbFvCtxManager} from "./RcsbFvContextManager";
import {OptionPropsInterface, SelectOptionInterface} from "../WebTools/SelectButton";
import {OptionProps} from "react-select/src/components/Option";

export interface InstanceSequenceOnchangeInterface {
    pdbId: string;
    authId: string;
    asymId: string;
}

export interface InstanceSequenceConfig {
    defaultValue?: string|undefined|null;
    onChangeCallback?:(x: InstanceSequenceOnchangeInterface)=>void;
    filterInstances?: Set<string>;
    displayAuthId?: boolean;
    selectButtonOptionProps?: (props: OptionProps<OptionPropsInterface>)=>JSX.Element;
}

export class RcsbFvInstanceBuilder {

    static async buildMultipleInstanceSequenceFv(elementFvId:string, elementEntrySelectId:string, elementInstanceSelectId:string, entryIdList: Array<string>, config: InstanceSequenceConfig): Promise<void> {
        RcsbFvCoreBuilder.buildSelectButton(elementFvId, elementEntrySelectId, entryIdList.map(entryId=>{
            return {
                label:entryId,
                shortLabel:entryId,
                onChange:()=>{
                    RcsbFvInstanceBuilder.buildInstanceSequenceFv(elementFvId, elementInstanceSelectId, entryId, {...config, displayAuthId: true});
                }
            }
        }),{addTitle:true, dropdownTitle:"PDB"});
        const entryId: string = entryIdList[0];
        await RcsbFvInstanceBuilder.buildInstanceSequenceFv(elementFvId, elementInstanceSelectId, entryId, {...config, displayAuthId: true});
        return void 0;
    }

    static async buildInstanceSequenceFv(elementFvId:string, elementSelectId:string, entryId: string, config: InstanceSequenceConfig): Promise<void> {
        const instanceCollector: EntryInstancesCollector = new EntryInstancesCollector();
        const result: Array<PolymerEntityInstanceInterface> = await instanceCollector.collect({entry_id:entryId});
        if(result.length == 0){
            RcsbFvCoreBuilder.showMessage(elementFvId, "No sequence features are available");
            return void 0;
        }else{
            rcsbFvCtxManager.setEntityToInstance(entryId, new PolymerEntityInstanceTranslate(result));
            return RcsbFvInstanceBuilder.buildSelectorInstanceFv(result, elementFvId, elementSelectId, entryId, config);
        }
    }

    static async buildSelectorInstanceFv(instanceList: Array<PolymerEntityInstanceInterface>, elementFvId:string, elementSelectId:string, entryId: string, config: InstanceSequenceConfig): Promise<void>{
        const filteredInstanceList: Array<PolymerEntityInstanceInterface> = instanceList.filter(i=>(config.filterInstances == null || config.filterInstances.has(i.asymId)));
        const groupedInstances: Map<string, Array<SelectOptionInterface>> = new Map<string, Array<SelectOptionInterface>>();
        filteredInstanceList.forEach((instance)=>{
            if(!groupedInstances.has(instance.entityId))
                groupedInstances.set(instance.entityId, new Array<SelectOptionInterface>());
            const label: string = instance.asymId === instance.authId ? instance.asymId : `${instance.asymId} [auth ${instance.authId}]`;
            groupedInstances.get(instance.entityId).push({
                name: instance.names + " - " + instance.taxIds.join(", "),
                label: label,
                groupLabel: `ENTITY ${instance.entityId} - ${instance.names}`,
                shortLabel: config.displayAuthId === true ? instance.authId : label,
                optId: instance.authId,
                onChange: async () => {
                    await RcsbFvInstanceBuilder.buildInstanceFv(
                        elementFvId,
                        instance.rcsbId
                    );
                    if (typeof config.onChangeCallback === "function")
                        config.onChangeCallback({
                            pdbId: instance.entryId,
                            authId: instance.authId,
                            asymId: instance.asymId
                        });
                }
            })
        });
        let index: number = 0;
        if (config.defaultValue != null) {
            const n: number = filteredInstanceList.findIndex(a => {
                return a.authId === config.defaultValue
            });
            if (n >= 0)
                index = n;
            else
                config.defaultValue = undefined
        }
        RcsbFvCoreBuilder.buildSelectButton(elementFvId, elementSelectId, Array.from(groupedInstances.values()).map(group=>({
            label: group[0].groupLabel,
            options: group
        })), {addTitle:true, defaultValue: config.defaultValue, dropdownTitle:"INSTANCE", width: config.displayAuthId === true ? 70 : undefined, optionProps: config.selectButtonOptionProps });
        await RcsbFvInstanceBuilder.buildInstanceFv(elementFvId, filteredInstanceList[index].rcsbId);
        if (typeof config.onChangeCallback === "function")
            config.onChangeCallback({
                pdbId: filteredInstanceList[index].entryId,
                authId: filteredInstanceList[index].authId,
                asymId: filteredInstanceList[index].asymId
            });
        return void 0;
    }

    static async buildInstanceFv(elementId: string, instanceId: string, additionalConfig?:RcsbFvAdditionalConfig): Promise<void> {
        return new Promise<void>((resolve,reject)=>{
            try {
                const buildFv: (p: PolymerEntityInstanceTranslate) => void = RcsbFvCoreBuilder.createFvBuilder(elementId, RcsbFvInstance, {
                    instanceId: instanceId,
                    additionalConfig: additionalConfig,
                    resolve: resolve
                });
                const entryId: string = instanceId.split(TagDelimiter.instance)[0];
                RcsbFvCoreBuilder.getPolymerEntityInstanceMapAndBuildFv(entryId, buildFv);
            }catch (e) {
                reject(e);
            }
        });
    }

}