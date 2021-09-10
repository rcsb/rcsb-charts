import {RcsbQueryAnnotations, RcsbQueryGroupAnnotations} from "./RcsbQueryAnnotations";
import {RcsbQueryAlignment, RcsbQueryGroupAlignment} from "./RcsbQueryAlignment";
import {
    AlignmentResponse,
    AnnotationFeatures,
    QueryAlignmentArgs,
    QueryAnnotationsArgs, QueryGroup_AlignmentArgs, QueryGroup_AnnotationsArgs
} from "@rcsb/rcsb-saguaro-api/build/RcsbGraphQL/Types/Borrego/GqlTypes";
import {
    CoreEntry, CoreGroup, CorePolymerEntity, QueryEntriesArgs,
    QueryEntryArgs, QueryPolymer_EntitiesArgs, QueryGroupArgs,
} from "@rcsb/rcsb-saguaro-api/build/RcsbGraphQL/Types/Yosemite/GqlTypes";
import {RcsbQueryEntryInstances} from "./RcsbQueryEntryInstances";
import {RcsbQueryMultipleEntityInstances} from "./RcsbQueryMultipleEntityInstances";
import {RcsbCoreQueryInterface} from "./RcsbCoreQueryInterface";
import {RcsbQueryGroup} from "./RcsbQueryGroup";
import {RcsbQueryMultipleEntriesProperties} from "./RcsbQueryMultipleEntriesProperties";

//TODO Implement a cache to store requests and avoid duplication
export class RcsbClient {
    private rcsbQueryAnnotations: RcsbCoreQueryInterface<QueryAnnotationsArgs,Array<AnnotationFeatures>> = new RcsbQueryAnnotations();
    private rcsbQueryGroupAnnotations: RcsbCoreQueryInterface<QueryGroup_AnnotationsArgs,Array<AnnotationFeatures>> = new RcsbQueryGroupAnnotations();
    private rcsbQueryAlignment: RcsbCoreQueryInterface<QueryAlignmentArgs,AlignmentResponse> = new RcsbQueryAlignment();
    private rcsbQueryGroupAlignment: RcsbCoreQueryInterface<QueryGroup_AlignmentArgs,AlignmentResponse> = new RcsbQueryGroupAlignment();
    private rcsbQueryEntityInstances: RcsbCoreQueryInterface<QueryEntryArgs,CoreEntry> = new RcsbQueryEntryInstances();
    private rcsbQueryMutipleEntityInstances: RcsbCoreQueryInterface<QueryPolymer_EntitiesArgs,Array<CorePolymerEntity>> = new RcsbQueryMultipleEntityInstances();
    private rcsbQueryEntryProperties: RcsbCoreQueryInterface<QueryEntriesArgs,Array<CoreEntry>> = new RcsbQueryMultipleEntriesProperties();

    public async requestRcsbPdbAnnotations(requestConfig: QueryAnnotationsArgs): Promise<Array<AnnotationFeatures>>{
        return await this.rcsbQueryAnnotations.request(requestConfig);
    }

    public async requestRcsbPdbGroupAnnotations(requestConfig: QueryGroup_AnnotationsArgs): Promise<Array<AnnotationFeatures>>{
        return await this.rcsbQueryGroupAnnotations.request(requestConfig);
    }

    public async requestAlignment(requestConfig: QueryAlignmentArgs): Promise<AlignmentResponse>{
        return await this.rcsbQueryAlignment.request(requestConfig);
    }

    public async requestGroupAlignment(requestConfig: QueryGroup_AlignmentArgs): Promise<AlignmentResponse>{
        return await this.rcsbQueryGroupAlignment.request(requestConfig);
    }

    public async requestEntityInstances(requestConfig: QueryEntryArgs): Promise<CoreEntry>{
        return await this.rcsbQueryEntityInstances.request(requestConfig);
    }

    public async requestMultipleEntityInstances(requestConfig: QueryPolymer_EntitiesArgs): Promise<Array<CorePolymerEntity>>{
        return await this.rcsbQueryMutipleEntityInstances.request(requestConfig);
    }

    public async requestGroupInfo(requestConfig: QueryGroupArgs): Promise<CoreGroup>{
        const rcsbQueryGroup: RcsbCoreQueryInterface<QueryGroupArgs,CoreGroup> = new RcsbQueryGroup();
        return await rcsbQueryGroup.request(requestConfig);
    }

    public async requestMultipleEntriesProperties(requestConfig: QueryEntriesArgs): Promise<Array<CoreEntry>>{
        return await this.rcsbQueryEntryProperties.request(requestConfig);
    }
}