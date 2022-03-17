import {rcsbClient, RcsbClient} from "../../RcsbGraphQL/RcsbClient";
import {CoreEntry, QueryEntriesArgs} from "@rcsb/rcsb-api-tools/build/RcsbGraphQL/Types/Yosemite/GqlTypes";
import {MultipleEntityInstancesCollector} from "./MultipleEntityInstancesCollector";

export interface EntryPropertyIntreface {
    rcsbId: string;
    entryId: string;
    experimentalMethod: string;
    resolution: number;
    name: string;
    taxNames: Array<string>;
    entryMolecularWeight: number;
    description:Array<string>;
}

export class MultipleEntryPropertyCollector {
    private readonly rcsbFvQuery: RcsbClient = rcsbClient;

    public async collect(requestConfig: QueryEntriesArgs): Promise<Array<EntryPropertyIntreface>> {
        const result: Array<CoreEntry> = await this.rcsbFvQuery.requestMultipleEntriesProperties(requestConfig);
        return result.map(r=>MultipleEntryPropertyCollector.getEntryProperties(r));
    }

    private static getEntryProperties(r:CoreEntry): EntryPropertyIntreface{
        return {
            rcsbId: r.rcsb_id,
            entryId: r.rcsb_id,
            experimentalMethod:r.rcsb_entry_info.experimental_method ,
            resolution: r.rcsb_entry_info.resolution_combined ? r.rcsb_entry_info.resolution_combined[0] : null,
            name: r.struct.title,
            description: r.pdbx_molecule_features?.map(mf=>mf.details),
            taxNames: r.polymer_entities.map((entity)=>(entity.rcsb_entity_source_organism.map((so)=>(so.ncbi_scientific_name)))).flat(),
            entryMolecularWeight: r.rcsb_entry_info.molecular_weight
        };
    }

}